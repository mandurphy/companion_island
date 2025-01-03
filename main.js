const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const { MD5 } = require('./md5')

class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
        this.updateStatus(InstanceStatus.Connecting)
		this.initActions()
		this.initPresets()
		this.initVariables()
		this.initFeedbacks()
        this.login()
	}

	async destroy() {
        this.stopPoll()
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
        this.login()
	}
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'number',
				id: 'port',
				label: 'Target Port',
				width: 4,
				default: 80,
				min: 1,
				max: 65535,
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Username',
				width: 6,
				default: 'admin',
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 6,
				default: 'admin',
			},
		]
	}
    async login() {
        this.updateStatus(InstanceStatus.Connecting)
        if (!this.config.host) {
            this.log('warn', 'No IP Address Set')
            this.updateStatus(InstanceStatus.ConfigError)
            return
        }
        try {
            // Hash password
            const hashedPassword = MD5(this.config.password)
            // Build login URL
            const protocol = 'http'
            const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
            const loginUrl = `${baseUrl}/link/user/lph_login?username=${this.config.username}&passwd=${hashedPassword}`
            // Make the login request
            const loginResponse = await this.fetch(loginUrl, {
                method: 'GET',
            })
            if (loginResponse.status !== 200) {
                this.log('error', `Login failed with status code ${loginResponse.status}`)
                this.updateStatus(InstanceStatus.ConnectionFailure)
                return
            }
            // Parse JSON response
            const loginData = await loginResponse.json()
            if (loginData.status !== 'success') {
                this.log('error', `Login failed. Response message: ${loginData.msg}`)
                this.updateStatus(InstanceStatus.ConnectionFailure)
                return
            }

            // Extract session cookie
            const cookie = loginResponse.headers.get('set-cookie')

            // Extract the hashes from the login data
            this.hashes = loginData.data

            // Store session cookie and device IP
            this.sessionCookie = cookie
            this.updateStatus(InstanceStatus.Ok)
            this.startPolling()
        } catch (error) {
            this.log('error', `Login failed. Error: ${error}`)
            this.updateStatus(InstanceStatus.ConnectionFailure)
        }
    }
    startPolling() {
        this.pollInterval = setInterval(() => {
            this.getDeviceInfo()
        }, this.interval_time)
    }

    stopPoll() {
        clearInterval(this.pollInterval)
        this.pollInterval = null
    }
    async getDeviceInfo() {
        //Get and update all the variables from the encoder
        try {
            if (!this.sessionCookie) {
                this.log('warn', 'No active session to get info from, logging in')
                this.login()
                return
            }

            // Build API URL
            const protocol = 'http'
            const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
            const systemInfoUrl = `${baseUrl}/api/system/info`
            const inputInfoUrl = `${baseUrl}/api/video/input`
            const encodeStatusUrl = `${baseUrl}/api/video/encode/status`

            const systemInfoResponse = await this.fetch(systemInfoUrl, {
                method: 'GET',
                headers: {
                    Cookie: this.sessionCookie,
                    'L-HASH': this.hashes['L-HASH'],
                    'P-HASH': this.hashes['P-HASH'],
                    'H-HASH': this.hashes['H-HASH'],
                },
            })
            const inputInfoResponse = await this.fetch(inputInfoUrl, {
                method: 'GET',
                headers: {
                    Cookie: this.sessionCookie,
                    'L-HASH': this.hashes['L-HASH'],
                    'P-HASH': this.hashes['P-HASH'],
                    'H-HASH': this.hashes['H-HASH'],
                },
            })
            const encodeStatusResponse = await this.fetch(encodeStatusUrl, {
                method: 'GET',
                headers: {
                    Cookie: this.sessionCookie,
                    'L-HASH': this.hashes['L-HASH'],
                    'P-HASH': this.hashes['P-HASH'],
                    'H-HASH': this.hashes['H-HASH'],
                },
            })
            if (systemInfoResponse.status !== 200 || inputInfoResponse.status !== 200 || encodeStatusResponse.status !== 200) {
                this.log(
                    'warn',
                    `Error getting device info. Status codes: System=${systemInfoResponse.status}, Input=${inputInfoResponse.status}, Encode=${encodeStatusResponse.status}`
                )
                return
            }

            const systemInfo = await systemInfoResponse.json()
            const inputInfo = await inputInfoResponse.json()
            const encodeStatus = await encodeStatusResponse.json()
            if (systemInfo.status !== 'success' || inputInfo.status !== 'success' || encodeStatus.status !== 'success') {
                this.log(
                    'warn',
                    `Error getting device info. Response messages: System=${systemInfo.msg}, Input=${inputInfo.msg}, Encode=${encodeStatus.msg}`
                )
                return
            }
            const variables = {}
            variables.deviceModel = systemInfo.data.product_name
            variables.deviceSerial = systemInfo.data.sn
            variables.firmwareVersion = systemInfo.data.version
            variables.videoInputFormat = inputInfo.data.video_in
            variables.encodeStatus = encodeStatus.data.status == 1 ? 'Encoding' : 'Not Encoding'
            this.setVariableValues(variables)
        } catch (error) {
            this.log('error', `Error getting device info: ${error}`)
        }
    }

    updateActions() {
		UpdateActions.bind(this)(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks.bind(this)(this)
	}
	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
    async setEncoderState(state) {
		try {
			if (!this.sessionCookie) {
				this.log('warn', 'No active session to set encode state. Logging in')
				this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setEncodeStatusUrl = `${baseUrl}/api/video/encode/status`

			const response = await this.fetch(setEncodeStatusUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status: state }),
			})

			if (response.status !== 200) {
				this.log('warn', `Error setting encode state. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting encode state. Response message: ${responseData.msg}`)
				return
			}
		} catch (error) {
			this.log('error', `Error setting encode state: ${error}`)
		}
		this.getDeviceInfo()
	}
	async rebootEncoder() {
		try {
			if (!this.sessionCookie) {
				this.log('warn', 'No active session to reboot. Logging in')
				this.login()
				return
			}

			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const rebootUrl = `${baseUrl}/api/system/reboot`

			const response = await this.fetch(rebootUrl, {
				method: 'GET',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
				},
			})

			if (response.status !== 200) {
				this.log('warn', `Error rebooting encoder. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error rebooting encoder. Response message: ${responseData.msg}`)
				return
			}
		} catch (error) {
			this.log('error', `Error rebooting encoder: ${error}`)
		}
	}
}
runEntrypoint(ModuleInstance, UpgradeScripts)