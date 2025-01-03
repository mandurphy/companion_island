const { combineRgb } = require('@companion-module/base')

module.exports = async function (self) {
	self.setFeedbackDefinitions({
		encode_status: {
            type: 'boolean',
            name: 'Encoding Status',
            description: 'Indicates if the encoder is currently encoding',
            defaultStyle: {
                bgcolor: combineRgb(0, 255, 0),
                color: combineRgb(0, 0, 0),
            },
            options: [],
            callback: (feedback) => {
                return self.getVariableValue('encodeStatus') === 'Encoding' ? true : false
            },
        },
        cpu_usage: {
            type: 'number',
            name: 'CPU Usage',
            description: 'Displays the CPU usage',
            options: [],
            callback: (feedback) => {
                return self.getVariableValue('cpuUsage')
            }
        },
        mem_usage: {
            type: 'number',
            name: 'Memory Usage',
            description: 'Displays the memory usage',
             options: [],
            callback: (feedback) => {
                return self.getVariableValue('memUsage')
            }
        },
        temperature: {
            type: 'number',
            name: 'Temperature',
            description: 'Displays the temperature of the device',
             options: [],
            callback: (feedback) => {
                return self.getVariableValue('temperature')
            }
        },
        network_rx: {
            type: 'number',
            name: 'Network RX',
            description: 'Displays the network receive speed',
             options: [],
            callback: (feedback) => {
                return self.getVariableValue('networkRx')
            }
        },
         network_tx: {
            type: 'number',
            name: 'Network TX',
            description: 'Displays the network transmit speed',
             options: [],
            callback: (feedback) => {
                return self.getVariableValue('networkTx')
            }
        },
        video_inputs: {
            type: 'advanced',
            name: 'Video Input Status',
            description: 'Displays detailed video input status',
            options: [],
            callback: (feedback) => {
               return self.getVariableValue('videoInputs')
            }
        },
        network_config: {
             type: 'advanced',
            name: 'Network Configuration',
            description: 'Displays the network configuration of the device',
             options: [],
            callback: (feedback) => {
               return self.getVariableValue('networkConfig')
            }
        },
        sys_date: {
             type: 'text',
            name: 'System Date',
            description: 'Displays the current date and time',
             options: [],
             callback: (feedback) => {
               return self.getVariableValue('sysDate')
            }
        },
        ntpd_config: {
            type: 'advanced',
            name: 'NTPD Configuration',
            description: 'Displays the current ntpd config',
             options: [],
            callback: (feedback) => {
               return self.getVariableValue('ntpdConfig')
            }
        },
        enc_confs: {
             type: 'advanced',
            name: 'Encoding Configuration',
            description: 'Displays the encoding configuration',
            options: [],
            callback: (feedback) => {
                return self.getVariableValue('encConfs')
            }
        },
          stream_confs: {
             type: 'advanced',
            name: 'Streaming Configuration',
             description: 'Displays the streaming configuration',
            options: [],
            callback: (feedback) => {
                return self.getVariableValue('streamConfs')
            }
        },
         hls_ndi_ts_confs: {
             type: 'advanced',
            name: 'HLS, NDI and TS Configuration',
            description: 'Displays the HLS, NDI, TS configuration',
             options: [],
            callback: (feedback) => {
                return self.getVariableValue('hlsNdiTsConfs')
            }
        },
         platform_lives: {
             type: 'advanced',
            name: 'Multi-Platform Live Configuration',
             description: 'Displays the multi-platform live configuration',
            options: [],
             callback: (feedback) => {
                return self.getVariableValue('platformLives')
            }
        },
         platform_lives_state: {
             type: 'advanced',
            name: 'Multi-Platform Live Streaming State',
            description: 'Displays the multi-platform live streaming state',
             options: [],
            callback: (feedback) => {
                return self.getVariableValue('platformLivesState')
            }
        },
        overlay_confs: {
              type: 'advanced',
            name: 'Overlay Configuration',
            description: 'Displays the watermark/overlay configuration',
             options: [],
             callback: (feedback) => {
               return self.getVariableValue('overlayConfs')
            }
        },
        def_lay_confs: {
              type: 'advanced',
            name: 'Default Layout Configurations',
             description: 'Displays the default layout configurations',
            options: [],
             callback: (feedback) => {
                return self.getVariableValue('defLayConfs')
            }
        },
        layout_confs: {
              type: 'advanced',
             name: 'Current Layout Configuration',
             description: 'Displays the current layout configuration',
             options: [],
             callback: (feedback) => {
                return self.getVariableValue('layoutConfs')
             }
        },
        output_confs: {
             type: 'advanced',
            name: 'Output Configurations',
            description: 'Displays the current output configurations',
             options: [],
             callback: (feedback) => {
                return self.getVariableValue('outputConfs')
             }
        },
         record_confs: {
             type: 'advanced',
            name: 'Recording Configuration',
            description: 'Displays the current recording configurations',
             options: [],
             callback: (feedback) => {
                return self.getVariableValue('recordConfs')
             }
        }
    })
}