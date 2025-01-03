const { MD5 } = require('./md5')

module.exports.ModuleLogic = class ModuleLogic {
	constructor(config, log, fetch, updateStatus) {
		this.sessionCookie = null
		this.hashes = {}
		this.config = config
		this.log = log
		this.fetch = fetch
        this.updateStatus = updateStatus
	}

	async login() {
		this.updateStatus("connecting")
		if (!this.config.host) {
			this.log('warn', 'No IP Address Set')
            this.updateStatus("configError")
			return false
		}
		try {
			const hashedPassword = MD5(this.config.password)
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const loginUrl = `${baseUrl}/link/user/lph_login?username=${this.config.username}&passwd=${hashedPassword}`

			const loginResponse = await this.fetch(loginUrl, {
				method: 'GET',
			})
			if (loginResponse.status !== 200) {
				this.log('error', `Login failed with status code ${loginResponse.status}`)
                this.updateStatus("connectionFailure")
				return false
			}
			const loginData = await loginResponse.json()
			if (loginData.status !== 'success') {
				this.log('error', `Login failed. Response message: ${loginData.msg}`)
                this.updateStatus("connectionFailure")
				return false
			}

			const cookie = loginResponse.headers.get('set-cookie')
			this.hashes = loginData.data
			this.sessionCookie = cookie
            this.updateStatus("ok")
			return true
		} catch (error) {
			this.log('error', `Login failed. Error: ${error}`)
            this.updateStatus("connectionFailure")
			return false
		}
	}

	async logout() {
		if (this.sessionCookie) {
			try {
				const protocol = 'http'
				const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
				const logoutUrl = `${baseUrl}/link/user/lph_logout`

				await this.fetch(logoutUrl, {
					method: 'GET',
					headers: {
						Cookie: this.sessionCookie,
						'L-HASH': this.hashes['L-HASH'],
						'P-HASH': this.hashes['P-HASH'],
						'H-HASH': this.hashes['H-HASH'],
					},
				})
				this.sessionCookie = null
				this.hashes = {}
				this.log('info', 'Logged out')
			} catch (error) {
				this.log('error', `Logout failed. Error: ${error}`)
			}
		} else {
			this.log('warn', 'No active session to logout from')
		}
	}

	async getDeviceInfo() {
		try {
			if (!this.sessionCookie) {
				this.log('warn', 'No active session to get info from, logging in')
                await this.login()
				return null;
			}

			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const systemInfoUrl = `${baseUrl}/api/system/info`
			const inputInfoUrl = `${baseUrl}/api/video/input`
			const encodeStatusUrl = `${baseUrl}/api/video/encode/status`
			const sysStateUrl = `${baseUrl}/link/system/get_sys_state`
			const netStateUrl = `${baseUrl}/link/system/get_net_state`
			const viStateUrl = `${baseUrl}/link/system/get_vi_state`
			const networkUrl = `${baseUrl}/link/system/get_network`
			const sysDateUrl = `${baseUrl}/link/system/get_sys_date`
			const ntpdUrl = `${baseUrl}/link/system/get_ntpd`
			const encConfsUrl = `${baseUrl}/link/encoder/get_enc_confs`
			const streamConfsUrl = `${baseUrl}/link/stream/get_stream_confs`
			const hlsNdiTsUrl = `${baseUrl}/link/stream/get_hls_ndi_ts`
			const platformLivesUrl = `${baseUrl}/link/stream/get_platform_lives`
			const platformLivesStateUrl = `${baseUrl}/link/stream/get_platform_lives_state`
			const overlayConfsUrl = `${baseUrl}/link/overlay/get_overlay_confs`
			const defLayConfsUrl = `${baseUrl}/link/layout/get_deflay_confs`
			const layoutConfsUrl = `${baseUrl}/link/layout/get_layout_confs`
			const outputConfsUrl = `${baseUrl}/link/output/get_output_confs`
			const recordConfsUrl = `${baseUrl}/link/record/get_record_confs`

			const headers = {
				Cookie: this.sessionCookie,
				'L-HASH': this.hashes['L-HASH'],
				'P-HASH': this.hashes['P-HASH'],
				'H-HASH': this.hashes['H-HASH'],
			}

			const [
				systemInfoResponse,
				inputInfoResponse,
				encodeStatusResponse,
				sysStateResponse,
				netStateResponse,
				viStateResponse,
				networkResponse,
				sysDateResponse,
				ntpdResponse,
				encConfsResponse,
				streamConfsResponse,
				hlsNdiTsResponse,
				platformLivesResponse,
				platformLivesStateResponse,
				overlayConfsResponse,
				defLayConfsResponse,
				layoutConfsResponse,
				outputConfsResponse,
				recordConfsResponse,
			] = await Promise.all([
				this.fetch(systemInfoUrl, { method: 'GET', headers }),
				this.fetch(inputInfoUrl, { method: 'GET', headers }),
				this.fetch(encodeStatusUrl, { method: 'GET', headers }),
				this.fetch(sysStateUrl, { method: 'GET', headers }),
				this.fetch(netStateUrl, { method: 'GET', headers }),
				this.fetch(viStateUrl, { method: 'GET', headers }),
				this.fetch(networkUrl, { method: 'GET', headers }),
				this.fetch(sysDateUrl, { method: 'GET', headers }),
				this.fetch(ntpdUrl, { method: 'GET', headers }),
				this.fetch(encConfsUrl, { method: 'GET', headers }),
				this.fetch(streamConfsUrl, { method: 'GET', headers }),
				this.fetch(hlsNdiTsUrl, { method: 'GET', headers }),
				this.fetch(platformLivesUrl, { method: 'GET', headers }),
				this.fetch(platformLivesStateUrl, { method: 'GET', headers }),
				this.fetch(overlayConfsUrl, { method: 'GET', headers }),
				this.fetch(defLayConfsUrl, { method: 'GET', headers }),
				this.fetch(layoutConfsUrl, { method: 'GET', headers }),
				this.fetch(outputConfsUrl, { method: 'GET', headers }),
				this.fetch(recordConfsUrl, { method: 'GET', headers }),
			])
			if (
				systemInfoResponse.status !== 200 ||
				inputInfoResponse.status !== 200 ||
				encodeStatusResponse.status !== 200 ||
				sysStateResponse.status !== 200 ||
				netStateResponse.status !== 200 ||
				viStateResponse.status !== 200 ||
				networkResponse.status !== 200 ||
				sysDateResponse.status !== 200 ||
				ntpdResponse.status !== 200 ||
				encConfsResponse.status !== 200 ||
				streamConfsResponse.status !== 200 ||
				hlsNdiTsResponse.status !== 200 ||
				platformLivesResponse.status !== 200 ||
				platformLivesStateResponse.status !== 200 ||
				overlayConfsResponse.status !== 200 ||
				defLayConfsResponse.status !== 200 ||
				layoutConfsResponse.status !== 200 ||
				outputConfsResponse.status !== 200 ||
				recordConfsResponse.status !== 200
			) {
				this.log(
					'warn',
					`Error getting device info. Status codes: System=${systemInfoResponse.status}, Input=${inputInfoResponse.status}, Encode=${encodeStatusResponse.status}, SysState=${sysStateResponse.status}, NetState=${netStateResponse.status}, ViState=${viStateResponse.status}, Network=${networkResponse.status}, SysDate=${sysDateResponse.status}, Ntpd=${ntpdResponse.status}, EncConfs=${encConfsResponse.status}, StreamConfs=${streamConfsResponse.status}, HlsNdiTs=${hlsNdiTsResponse.status}, PlatformLives=${platformLivesResponse.status}, PlatformLivesState=${platformLivesStateResponse.status}, OverlayConfs=${overlayConfsResponse.status}, DefLayConfs=${defLayConfsResponse.status}, LayoutConfs=${layoutConfsResponse.status}, OutputConfs=${outputConfsResponse.status}, RecordConfs=${recordConfsResponse.status}`
				)
				return null;
			}

			const systemInfo = await systemInfoResponse.json()
			const inputInfo = await inputInfoResponse.json()
			const encodeStatus = await encodeStatusResponse.json()
			const sysState = await sysStateResponse.json()
			const netState = await netStateResponse.json()
			const viState = await viStateResponse.json()
			const network = await networkResponse.json()
			const sysDate = await sysDateResponse.json()
			const ntpd = await ntpdResponse.json()
			const encConfs = await encConfsResponse.json()
			const streamConfs = await streamConfsResponse.json()
			const hlsNdiTs = await hlsNdiTsResponse.json()
			const platformLives = await platformLivesResponse.json()
			const platformLivesState = await platformLivesStateResponse.json()
			const overlayConfs = await overlayConfsResponse.json()
			const defLayConfs = await defLayConfsResponse.json()
			const layoutConfs = await layoutConfsResponse.json()
			const outputConfs = await outputConfsResponse.json()
			const recordConfs = await recordConfsResponse.json()

			if (
				systemInfo.status !== 'success' ||
				inputInfo.status !== 'success' ||
				encodeStatus.status !== 'success' ||
				sysState.status !== 'success' ||
				netState.status !== 'success' ||
				viState.status !== 'success' ||
				network.status !== 'success' ||
				sysDate.status !== 'success' ||
				ntpd.status !== 'success' ||
				encConfs.status !== 'success' ||
				streamConfs.status !== 'success' ||
				hlsNdiTs.status !== 'success' ||
				platformLives.status !== 'success' ||
				platformLivesState.status !== 'success' ||
				overlayConfs.status !== 'success' ||
				defLayConfs.status !== 'success' ||
				layoutConfs.status !== 'success' ||
				outputConfs.status !== 'success' ||
				recordConfs.status !== 'success'
			) {
				this.log(
					'warn',
					`Error getting device info. Response messages: System=${systemInfo.msg}, Input=${inputInfo.msg}, Encode=${encodeStatus.msg}, SysState=${sysState.msg}, NetState=${netState.msg}, ViState=${viState.msg}, Network=${network.msg}, SysDate=${sysDate.msg}, Ntpd=${ntpd.msg}, EncConfs=${encConfs.msg}, StreamConfs=${streamConfs.msg}, HlsNdiTs=${hlsNdiTs.msg}, PlatformLives=${platformLives.msg}, PlatformLivesState=${platformLivesState.msg}, OverlayConfs=${overlayConfs.msg}, DefLayConfs=${defLayConfs.msg}, LayoutConfs=${layoutConfs.msg}, OutputConfs=${outputConfs.msg}, RecordConfs=${recordConfs.msg}`
				)
				return null
			}
			const variables = {}

			variables.deviceModel = systemInfo.data.product_name
			variables.deviceSerial = systemInfo.data.sn
			variables.firmwareVersion = systemInfo.data.version
			variables.videoInputFormat = inputInfo.data.video_in
			variables.encodeStatus = encodeStatus.data.status == 1 ? 'Encoding' : 'Not Encoding'
			variables.cpuUsage = sysState.data.cpu
			variables.memUsage = sysState.data.mem
			variables.temperature = sysState.data.temperature
			variables.networkRx = netState.data.rx
			variables.networkTx = netState.data.tx
			variables.videoInputs = viState.data
			variables.networkConfig = network.data
			variables.sysDate = sysDate.data
			variables.ntpdConfig = ntpd.data
			variables.encConfs = encConfs.data
			variables.streamConfs = streamConfs.data
			variables.hlsNdiTsConfs = hlsNdiTs.data
			variables.platformLives = platformLives.data
			variables.platformLivesState = platformLivesState.data
			variables.overlayConfs = overlayConfs.data
			variables.defLayConfs = defLayConfs.data
			variables.layoutConfs = layoutConfs.data
			variables.outputConfs = outputConfs.data
			variables.recordConfs = recordConfs.data
            return variables;
		} catch (error) {
			this.log('error', `Error getting device info: ${error}`)
            return null
		}
	}

    async setEncoderState(state) {
		try {
			if (!this.sessionCookie) {
				this.log('warn', 'No active session to set encode state. Logging in')
				await this.login()
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
        return await this.getDeviceInfo();
	}
    async rebootEncoder() {
        try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to reboot. Logging in')
				await this.login()
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
        return await this.getDeviceInfo();
    }
    async setNetworkConfig(ip, mask, gateway, dns, dhcp) {
        try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set network config. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setNetworkUrl = `${baseUrl}/link/system/set_network`

            const requestBody = {}
            if(ip){
                requestBody.ip = ip;
            }
             if(mask){
                requestBody.mask = mask;
            }
             if(gateway){
                requestBody.gateway = gateway;
            }
            if(dns){
                requestBody.DNS = dns;
            }
            if (dhcp != null){
                requestBody.dhcp = dhcp
            }

			const response = await this.fetch(setNetworkUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting network config. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting network config. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting network config: ${error}`)
        }
        return await this.getDeviceInfo()
    }
    async setSysDate(sysDate) {
         try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set system date. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setSysDateUrl = `${baseUrl}/link/system/set_sys_date`


			const response = await this.fetch(setSysDateUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify({sysDate: sysDate}),
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting system date. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting system date. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting system date: ${error}`)
        }
        return await this.getDeviceInfo()
    }
    async setNtpdConfig(server, enable, sync){
        try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set ntpd config. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setNtpdUrl = `${baseUrl}/link/system/set_ntpd`

            const requestBody = {}
            if(server){
                requestBody.server = server;
            }
            if(enable != null){
                requestBody.enable = enable
            }
            if(sync != null){
                requestBody.sync = sync
            }

			const response = await this.fetch(setNtpdUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting NTP config. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting NTP config. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting NTP config: ${error}`)
        }
        return await this.getDeviceInfo()
    }
    async setEncChns(id, enable, enable2, codec, profile, rcmode, width, height, bitrate, framerate, gop, minqp, maxqp, Iqp, Pqp, lowLatency){
         try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set encoding parameters. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setEncChnsUrl = `${baseUrl}/link/encoder/set_enc_chns`

            const requestBody = [{
                id: id,
                enable: enable,
                enable2: enable2,
				encv: {
                    codec: codec,
                    profile: profile,
                    rcmode: rcmode,
                    width: width,
                    height: height,
					bitrate: bitrate,
					framerate: framerate,
					gop: gop,
					minqp: minqp,
					maxqp: maxqp,
					Iqp: Iqp,
					Pqp: Pqp,
					lowLatency: lowLatency,
                },
            }]

			const response = await this.fetch(setEncChnsUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting encode parameters. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting encode parameters. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting encode parameters: ${error}`)
        }
        return await this.getDeviceInfo()
    }
    async setNetChns(id, path, decodeV, enable, enable2, bufferMode, minDelay, protocol, framerate, decodeA){
        try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set network input parameters. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setNetChnsUrl = `${baseUrl}/link/encoder/set_net_chns`

            const requestBody = [{
                id: id,
                path: path,
				decodeV: decodeV,
				enable: enable,
				enable2: enable2,
                bufferMode: bufferMode,
                minDelay: minDelay,
				protocol: protocol,
                framerate: framerate,
				decodeA: decodeA,
            }]

			const response = await this.fetch(setNetChnsUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting network input parameters. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting network input parameters. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting network input parameters: ${error}`)
        }
       return await this.getDeviceInfo()
    }
    async setCapChns(id, L, R, T, B, rotate, deinterlace){
         try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set HDMI/SDI parameters. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setCapChnsUrl = `${baseUrl}/link/encoder/set_cap_chns`

            const requestBody = [{
                id: id,
				L: L,
                R: R,
                T: T,
                B: B,
				rotate: rotate,
				deinterlace: deinterlace,
            }]

			const response = await this.fetch(setCapChnsUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting HDMI/SDI parameters. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting HDMI/SDI parameters. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting HDMI/SDI parameters: ${error}`)
        }
        return await this.getDeviceInfo()
    }
    async setAudioChns(id, codec, audioSrc, gain, samplerate, channels, bitrate){
         try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set audio parameters. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setAudioChnsUrl = `${baseUrl}/link/encoder/set_audio_chns`

            const requestBody = [{
                id: id,
                codec: codec,
                audioSrc: audioSrc,
                gain: gain,
				samplerate: samplerate,
				channels: channels,
				bitrate: bitrate,
            }]

			const response = await this.fetch(setAudioChnsUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting audio parameters. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting audio parameters. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting audio parameters: ${error}`)
        }
         return await this.getDeviceInfo()
    }
    async setStreamConfs(id, hls, http, rtsp, rtmp, pushEnable, pushPath, udpEnable, udpIp, udpPort, srtEnable, srtIp, srtPort){
        try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set stream parameters. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setStreamConfsUrl = `${baseUrl}/link/stream/set_stream_confs`

            const requestBody = [{
                id: id,
                stream: {
                    hls: hls,
                    http: http,
                    rtsp: rtsp,
					rtmp: rtmp,
					push: {
						enable: pushEnable,
                        path: pushPath,
					},
                    udp: {
                        enable: udpEnable,
                        ip: udpIp,
                        port: udpPort
                    },
                    srt: {
                        enable: srtEnable,
                        ip: srtIp,
                        port: srtPort,
                    }
                },
                stream2: {
                    hls: false,
                    http: false,
                    rtsp: false,
					rtmp: false,
                    push:{
						enable: false,
					},
                    udp: {
                        enable: false,
                    },
                    srt:{
                         enable: false,
                    }
                }
            }]

			const response = await this.fetch(setStreamConfsUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting stream parameters. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting stream parameters. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting stream parameters: ${error}`)
        }
        return await this.getDeviceInfo()
    }
    async setHlsNdiTs(id, hlsTime, hlsListSize, ndiEnable, ndiName, mpegts_pmt_start_pid, mpegts_original_network_id, mpegts_start_pid){
         try {
            if (!this.sessionCookie) {
				this.log('warn', 'No active session to set HLS, NDI or TS parameters. Logging in')
				await this.login()
				return
			}
			const protocol = 'http'
			const baseUrl = `${protocol}://${this.config.host}:${this.config.port}`
			const setHlsNdiTsUrl = `${baseUrl}/link/stream/set_hls_ndi_ts`

            const requestBody = [{
                id: id,
				hls: {
                    hls_time: hlsTime,
                    hls_list_size: hlsListSize
                },
				ndi: {
					enable: ndiEnable,
					name: ndiName
				},
                ts: {
                   mpegts_pmt_start_pid: mpegts_pmt_start_pid,
                   mpegts_original_network_id: mpegts_original_network_id,
                   mpegts_start_pid: mpegts_start_pid
                }
            }]

			const response = await this.fetch(setHlsNdiTsUrl, {
				method: 'POST',
				headers: {
					Cookie: this.sessionCookie,
					'L-HASH': this.hashes['L-HASH'],
					'P-HASH': this.hashes['P-HASH'],
					'H-HASH': this.hashes['H-HASH'],
                    'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			if (response.status !== 200) {
				this.log('warn', `Error setting HLS, NDI or TS parameters. Status Code: ${response.status}`)
				return
			}
			const responseData = await response.json()
			if (responseData.status !== 'success') {
				this.log('warn', `Error setting HLS, NDI or TS parameters. Response message: ${responseData.msg}`)
				return
			}
        } catch (error) {
            this.log('error', `Error setting HLS, NDI or TS parameters: ${error}`)
        }
       return await this.getDeviceInfo()
    }
}