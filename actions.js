module.exports = function (self) {
	self.setActionDefinitions({
		start_encode: {
			name: 'Start Encoding',
			options: [],
			callback: async (event) => {
				await self.setEncoderState(1)
			},
		},
		stop_encode: {
			name: 'Stop Encoding',
			options: [],
			callback: async (event) => {
				await self.setEncoderState(0)
			},
		},
		reboot_encoder: {
			name: 'Reboot Encoder',
			options: [],
			callback: async (event) => {
				await self.rebootEncoder()
			},
		},
		set_network: {
			name: 'Set Network Configuration',
			options: [
				{
					type: 'textinput',
					id: 'ip',
					label: 'IP Address',
				},
				{
					type: 'textinput',
					id: 'mask',
					label: 'Subnet Mask',
				},
				{
					type: 'textinput',
					id: 'gateway',
					label: 'Gateway',
				},
				{
					type: 'textinput',
					id: 'dns',
					label: 'DNS',
				},
				{
					type: 'checkbox',
					id: 'dhcp',
					label: 'Use DHCP',
					default: false,
				},
			],
			callback: async (event) => {
				const { ip, mask, gateway, dns, dhcp } = event.options
				await self.setNetworkConfig(ip, mask, gateway, dns, dhcp)
			},
		},
		set_sys_date: {
			name: 'Set System Date',
			options: [
				{
					type: 'textinput',
					id: 'sysDate',
					label: 'System Date (yyyy/MM/dd/hh/mm/ss)',
				},
			],
			callback: async (event) => {
				const { sysDate } = event.options
				await self.setSysDate(sysDate)
			},
		},
		set_ntpd: {
			name: 'Set NTP Configuration',
			options: [
				{
					type: 'textinput',
					id: 'server',
					label: 'NTP Server Address',
				},
				{
					type: 'checkbox',
					id: 'enable',
					label: 'Enable NTP on boot',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'sync',
					label: 'Sync NTP immediately',
					default: false,
				},
			],
			callback: async (event) => {
				const { server, enable, sync } = event.options
				await self.setNtpdConfig(server, enable, sync)
			},
		},

		set_enc_chns: {
			name: 'Set Encoding Channel Parameters',
			options: [
				{
					type: 'number',
					id: 'id',
					label: 'Channel ID',
					min: 0,
				},
				{
					type: 'checkbox',
					id: 'enable',
					label: 'Enable Main Stream',
					default: true,
				},
				{
					type: 'checkbox',
					id: 'enable2',
					label: 'Enable Sub Stream',
					default: false,
				},
				{
					type: 'dropdown',
					id: 'codec',
					label: 'Codec',
					default: 'h264',
					choices: [
						{ id: 'h264', label: 'H.264' },
						{ id: 'h265', label: 'H.265' },
						{ id: 'close', label: 'Close' },
					],
				},
				{
					type: 'dropdown',
					id: 'profile',
					label: 'Profile',
					default: 'main',
					choices: [
						{ id: 'base', label: 'Base' },
						{ id: 'main', label: 'Main' },
						{ id: 'high', label: 'High' },
					],
				},
				{
					type: 'dropdown',
					id: 'rcmode',
					label: 'Rate Control Mode',
					default: 'cbr',
					choices: [
						{ id: 'cbr', label: 'CBR' },
						{ id: 'vbr', label: 'VBR' },
						{ id: 'avbr', label: 'AVBR' },
						{ id: 'fixqp', label: 'FixQP' },
					],
				},
				{
					type: 'number',
					id: 'width',
					label: 'Video Width (-1 for default)',
					min: -1,
					default: -1,
				},
				{
					type: 'number',
					id: 'height',
					label: 'Video Height (-1 for default)',
					min: -1,
					default: -1,
				},
				{
					type: 'number',
					id: 'bitrate',
					label: 'Bitrate (kbps)',
					min: 0,
					default: 4000,
				},
				{
					type: 'number',
					id: 'framerate',
					label: 'Frame rate',
					min: 0,
					default: 30,
				},
				{
					type: 'number',
					id: 'gop',
					label: 'GOP Size',
					min: 0,
					default: 2,
				},
				{
					type: 'number',
					id: 'minqp',
					label: 'Minimum Quantization Factor',
					min: 0,
					default: 22,
				},
				{
					type: 'number',
					id: 'maxqp',
					label: 'Maximum Quantization Factor',
					min: 0,
					default: 36,
				},
				{
					type: 'number',
					id: 'Iqp',
					label: 'I frame Quantization Factor',
					min: 0,
					default: 25,
				},
				{
					type: 'number',
					id: 'Pqp',
					label: 'P frame Quantization Factor',
					min: 0,
					default: 25,
				},
				{
					type: 'checkbox',
					id: 'lowLatency',
					label: 'Low Latency',
					default: false,
				},
			],
			callback: async (event) => {
				const { id, enable, enable2, codec, profile, rcmode, width, height, bitrate, framerate, gop, minqp, maxqp, Iqp, Pqp, lowLatency } =
					event.options
				await self.setEncChns(id, enable, enable2, codec, profile, rcmode, width, height, bitrate, framerate, gop, minqp, maxqp, Iqp, Pqp, lowLatency)
			},
		},
		set_net_chns: {
			name: 'Set Network Channel Parameters',
			options: [
				{
					type: 'number',
					id: 'id',
					label: 'Channel ID',
					min: 0,
				},
				{
					type: 'textinput',
					id: 'path',
					label: 'Network Stream Address',
				},
				{
					type: 'checkbox',
					id: 'decodeV',
					label: 'Decode Video',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'enable',
					label: 'Enable Channel',
					default: true,
				},
				{
					type: 'checkbox',
					id: 'enable2',
					label: 'Enable Sub Stream',
					default: false,
				},
				{
					type: 'number',
					id: 'bufferMode',
					label: 'Buffer Mode',
					min: 0,
					max: 2,
					default: 0,
				},
				{
					type: 'number',
					id: 'minDelay',
					label: 'Buffer Time',
					min: 0,
					default: 500,
				},
				{
					type: 'dropdown',
					id: 'protocol',
					label: 'Protocol',
					default: 'tcp',
					choices: [
						{ id: 'tcp', label: 'TCP' },
						{ id: 'udp', label: 'UDP' },
					],
				},
				{
					type: 'number',
					id: 'framerate',
					label: 'Frame Rate',
					default: -1,
				},
				{
					type: 'checkbox',
					id: 'decodeA',
					label: 'Decode Audio',
					default: false,
				},
			],
			callback: async (event) => {
				const { id, path, decodeV, enable, enable2, bufferMode, minDelay, protocol, framerate, decodeA } = event.options
				await self.setNetChns(id, path, decodeV, enable, enable2, bufferMode, minDelay, protocol, framerate, decodeA)
			},
		},
		set_cap_chns: {
			name: 'Set HDMI/SDI Cropping and Rotation',
			options: [
				{
					type: 'number',
					id: 'id',
					label: 'Channel ID',
					min: 0,
				},
				{
					type: 'number',
					id: 'L',
					label: 'Crop Left',
					min: 0,
					default: 0,
				},
				{
					type: 'number',
					id: 'R',
					label: 'Crop Right',
					min: 0,
					default: 0,
				},
				{
					type: 'number',
					id: 'T',
					label: 'Crop Top',
					min: 0,
					default: 0,
				},
				{
					type: 'number',
					id: 'B',
					label: 'Crop Bottom',
					min: 0,
					default: 0,
				},
				{
					type: 'dropdown',
					id: 'rotate',
					label: 'Rotate',
					default: 0,
					choices: [
						{ id: 0, label: '0 Degrees' },
						{ id: 90, label: '90 Degrees' },
						{ id: 180, label: '180 Degrees' },
						{ id: 270, label: '270 Degrees' },
					],
				},
				{
					type: 'checkbox',
					id: 'deinterlace',
					label: 'Deinterlace',
					default: false,
				},
			],
			callback: async (event) => {
				const { id, L, R, T, B, rotate, deinterlace } = event.options
				await self.setCapChns(id, L, R, T, B, rotate, deinterlace)
			},
		},
		set_audio_chns: {
			name: 'Set Audio Encoding Parameters',
			options: [
				{
					type: 'number',
					id: 'id',
					label: 'Channel ID',
					min: 0,
				},
				{
					type: 'dropdown',
					id: 'codec',
					label: 'Codec',
					default: 'aac',
					choices: [
						{ id: 'aac', label: 'AAC' },
						{ id: 'pcma', label: 'PCMA' },
						{ id: 'mp2', label: 'MP2' },
						{ id: 'mp3', label: 'MP3' },
						{ id: 'opus', label: 'Opus' },
						{ id: 'close', label: 'Close' },
					],
				},
				{
					type: 'dropdown',
					id: 'audioSrc',
					label: 'Audio Source',
					default: 'hdmi',
					choices: [
						{ id: 'hdmi', label: 'HDMI' },
						{ id: 'sdi', label: 'SDI' },
						{ id: 'line', label: 'Line' },
					],
				},
				{
					type: 'dropdown',
					id: 'gain',
					label: 'Gain',
					default: 6,
					choices: [
						{ id: -24, label: '-24' },
						{ id: -18, label: '-18' },
						{ id: -12, label: '-12' },
						{ id: -6, label: '-6' },
						{ id: 0, label: '0' },
						{ id: 6, label: '6' },
						{ id: 12, label: '12' },
						{ id: 18, label: '18' },
						{ id: 24, label: '24' },
					],
				},
				{
					type: 'dropdown',
					id: 'samplerate',
					label: 'Sample Rate',
					default: 48000,
					choices: [
						{ id: 16000, label: '16000' },
						{ id: 32000, label: '32000' },
						{ id: 44100, label: '44100' },
						{ id: 48000, label: '48000' },
						{ id: -1, label: 'Automatic' },
					],
				},
				{
					type: 'dropdown',
					id: 'channels',
					label: 'Channels',
					default: 1,
					choices: [
						{ id: 1, label: 'Mono' },
						{ id: 2, label: 'Stereo' },
					],
				},
				{
					type: 'number',
					id: 'bitrate',
					label: 'Bitrate',
					default: 128,
				},
			],
			callback: async (event) => {
				const { id, codec, audioSrc, gain, samplerate, channels, bitrate } = event.options
				await self.setAudioChns(id, codec, audioSrc, gain, samplerate, channels, bitrate)
			},
		},
    }
}
		set_stream_confs: {
			name: 'Set Video Stream Output Configuration',
			options: [
				{
					type: 'number',
					id: 'id',
					label: 'Channel ID',
					min: 0,
				},
				{
					type: 'checkbox',
					id: 'hls',
					label: 'Enable HLS',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'http',
					label: 'Enable HTTP',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'rtsp',
					label: 'Enable RTSP',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'rtmp',
					label: 'Enable RTMP',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'pushEnable',
					label: 'Enable Push Streaming',
					default: false,
				},
				{
					type: 'textinput',
					id: 'pushPath',
					label: 'Push Stream Path',
				},
				{
					type: 'checkbox',
					id: 'udpEnable',
					label: 'Enable UDP Multicast',
					default: false,
				},
				{
					type: 'textinput',
					id: 'udpIp',
					label: 'UDP Multicast IP',
				},
				{
					type: 'number',
					id: 'udpPort',
					label: 'UDP Multicast Port',
					min: 0,
					default: 3000,
				},
				{
					type: 'checkbox',
					id: 'srtEnable',
					label: 'Enable SRT',
					default: false,
				},
				{
					type: 'textinput',
					id: 'srtIp',
					label: 'SRT IP',
				},
				{
					type: 'number',
					id: 'srtPort',
					label: 'SRT Port',
					min: 0,
					default: 9001,
				},
			],
			callback: async (event) => {
				const { id, hls, http, rtsp, rtmp, pushEnable, pushPath, udpEnable, udpIp, udpPort, srtEnable, srtIp, srtPort } =
					event.options
				await self.setStreamConfs(
					id,
					hls,
					http,
					rtsp,
					rtmp,
					pushEnable,
					pushPath,
					udpEnable,
					udpIp,
					udpPort,
					srtEnable,
					srtIp,
					srtPort
				)
			},
		},
		set_hls_ndi_ts: {
			name: 'Set HLS, NDI, TS Configuration',
			options: [
				{
					type: 'number',
					id: 'id',
					label: 'Channel ID',
					min: 0,
				},
				{
					type: 'number',
					id: 'hlsTime',
					label: 'HLS Segment Length',
					min: 0,
					default: 5,
				},
				{
					type: 'number',
					id: 'hlsListSize',
					label: 'HLS List Size',
					min: 0,
					default: 5,
				},
				{
					type: 'checkbox',
					id: 'ndiEnable',
					label: 'Enable NDI',
					default: false,
				},
				{
					type: 'textinput',
					id: 'ndiName',
					label: 'NDI Name',
				},
                {
					type: 'number',
					id: 'mpegts_pmt_start_pid',
					label: 'MPEGTS PMT PID',
					min: 0,
					default: 4096,
				},
                {
                    type: 'number',
                    id: 'mpegts_original_network_id',
                    label: 'MPEGTS Original Network ID',
                    min: 0,
                    default: 1,
                },
                {
                    type: 'number',
                    id: 'mpegts_start_pid',
                    label: 'MPEGTS Start PID',
                    min: 0,
                    default: 100,
                }
			],
			callback: async (event) => {
				const { id, hlsTime, hlsListSize, ndiEnable, ndiName, mpegts_pmt_start_pid, mpegts_original_network_id, mpegts_start_pid } =
					event.options
				await self.setHlsNdiTs(id, hlsTime, hlsListSize, ndiEnable, ndiName, mpegts_pmt_start_pid, mpegts_original_network_id, mpegts_start_pid)
			},
		},
		set_platform_lives: {
			name: 'Set Multi-platform Live Configuration',
			options: [
				{
					type: 'checkbox',
					id: 'autorun',
					label: 'Auto start on boot',
					default: false,
				},
				{
					type: 'number',
					id: 'srcA',
					label: 'Audio Source',
					min: 0,
					default: 0,
				},
				{
					type: 'number',
					id: 'srcV',
					label: 'Video Source',
					min: 0,
					default: 0,
				},
				{
					type: 'textinput',
					id: 'url1',
					label: 'Platform 1 URL',
				},
				{
					type: 'textinput',
					id: 'des1',
					label: 'Platform 1 Description',
				},
				{
					type: 'checkbox',
					id: 'enable1',
					label: 'Enable Platform 1',
					default: false,
				},
				{
					type: 'textinput',
					id: 'url2',
					label: 'Platform 2 URL',
				},
				{
					type: 'textinput',
					id: 'des2',
					label: 'Platform 2 Description',
				},
				{
					type: 'checkbox',
					id: 'enable2',
					label: 'Enable Platform 2',
					default: false,
				},
				{
					type: 'textinput',
					id: 'url3',
					label: 'Platform 3 URL',
				},
				{
					type: 'textinput',
					id: 'des3',
					label: 'Platform 3 Description',
				},
				{
					type: 'checkbox',
					id: 'enable3',
					label: 'Enable Platform 3',
					default: false,
				},
				{
					type: 'textinput',
					id: 'url4',
					label: 'Platform 4 URL',
				},
				{
					type: 'textinput',
					id: 'des4',
					label: 'Platform 4 Description',
				},
				{
					type: 'checkbox',
					id: 'enable4',
					label: 'Enable Platform 4',
					default: false,
				},
			],
			callback: async (event) => {
				const { autorun, srcA, srcV, url1, des1, enable1, url2, des2, enable2, url3, des3, enable3, url4, des4, enable4 } =
					event.options
				await self.setPlatformLives(
					autorun,
					srcA,
					srcV,
					url1,
					des1,
					enable1,
					url2,
					des2,
					enable2,
					url3,
					des3,
					enable3,
					url4,
					des4,
					enable4
				)
			},
		},
		start_platform_lives: {
			name: 'Start Multi-platform Live Streaming',
			options: [],
			callback: async (event) => {
				await self.startPlatformLives()
			},
		},
		stop_platform_lives: {
			name: 'Stop Multi-platform Live Streaming',
			options: [],
			callback: async (event) => {
				await self.stopPlatformLives()
			},
		},
        set_overlay_confs: {
            name: 'Set Watermark Configuration',
            options: [
                {
					type: 'number',
					id: 'id',
					label: 'Channel ID',
					min: 0,
				},
                {
                    type: 'textinput',
                    id: 'overlay1Type',
                    label: 'Overlay 1 Type (text, time, pic, mask, border, rect)'
                },
                {
                    type: 'checkbox',
                    id: 'overlay1Enable',
                    label: 'Enable Overlay 1'
                },
                {
                    type: 'textinput',
                    id: 'overlay1Content',
                    label: 'Overlay 1 Content'
                },
                {
                    type: 'textinput',
                    id: 'overlay1x',
                    label: 'Overlay 1 X Position'
                },
                {
                    type: 'textinput',
                    id: 'overlay1y',
                    label: 'Overlay 1 Y Position'
                },
                {
                    type: 'textinput',
                    id: 'overlay1scale',
                    label: 'Overlay 1 Scale'
                },
                {
                    type: 'textinput',
                    id: 'overlay1color',
                    label: 'Overlay 1 Color'
                },
                 {
                    type: 'textinput',
                    id: 'overlay1bgColor',
                    label: 'Overlay 1 Background Color'
                },
                {
                    type: 'textinput',
                    id: 'overlay1alpha',
                    label: 'Overlay 1 Alpha'
                },
                 {
                    type: 'textinput',
                    id: 'overlay1move',
                    label: 'Overlay 1 Move'
                },
                {
                    type: 'textinput',
                    id: 'overlay1w',
                    label: 'Overlay 1 Width'
                },
				{
                    type: 'textinput',
                    id: 'overlay2Type',
                    label: 'Overlay 2 Type (text, time, pic, mask, border, rect)'
                },
                {
                    type: 'checkbox',
                    id: 'overlay2Enable',
                    label: 'Enable Overlay 2'
                },
                {
                    type: 'textinput',
                    id: 'overlay2Content',
                    label: 'Overlay 2 Content'
                },
                {
                    type: 'textinput',
                    id: 'overlay2x',
                    label: 'Overlay 2 X Position'
                },
                {
                    type: 'textinput',
                    id: 'overlay2y',
                    label: 'Overlay 2 Y Position'
                },
                {
                    type: 'textinput',
                    id: 'overlay2scale',
                    label: 'Overlay 2 Scale'
                },
                {
                    type: 'textinput',
                    id: 'overlay2color',
                    label: 'Overlay 2 Color'
                },
                 {
                    type: 'textinput',
                    id: 'overlay2bgColor',
                    label: 'Overlay 2 Background Color'
                },
                {
                    type: 'textinput',
                    id: 'overlay2alpha',
                    label: 'Overlay 2 Alpha'
                },
                 {
                    type: 'textinput',
                    id: 'overlay2move',
                    label: 'Overlay 2 Move'
                },
                {
                    type: 'textinput',
                    id: 'overlay2w',
                    label: 'Overlay 2 Width'
                },
            ],
            callback: async (event) => {
                const { id, overlay1Type, overlay1Enable, overlay1Content, overlay1x, overlay1y, overlay1scale, overlay1color, overlay1bgColor, overlay1alpha, overlay1move, overlay1w, overlay2Type, overlay2Enable, overlay2Content, overlay2x, overlay2y, overlay2scale, overlay2color, overlay2bgColor, overlay2alpha, overlay2move, overlay2w } = event.options
                await self.setOverlayConfs(id, overlay1Type, overlay1Enable, overlay1Content, overlay1x, overlay1y, overlay1scale, overlay1color, overlay1bgColor, overlay1alpha, overlay1move, overlay1w, overlay2Type, overlay2Enable, overlay2Content, overlay2x, overlay2y, overlay2scale, overlay2color, overlay2bgColor, overlay2alpha, overlay2move, overlay2w)
            }
        },
		set_layout_confs: {
			name: 'Set Video Layout and Mixing',
			options: [
				{
					type: 'number',
					id: 'layId',
					label: 'Layout ID',
					min: 0,
				},
				{
					type: 'textinput',
					id: 'srcV',
					label: 'Video Channel IDs (-1 for placeholder, comma separated)',
				},
				{
					type: 'textinput',
					id: 'srcA',
					label: 'Audio Channel IDs (comma separated)',
				},
			],
			callback: async (event) => {
				const { layId, srcV, srcA } = event.options
				await self.setLayoutConfs(layId, srcV, srcA)
			},
		},
        set_output_confs: {
            name: 'Set Output Configuration',
            options: [
                {
                    type: 'checkbox',
                    id: 'enable',
                    label: 'Enable HDMI Output',
                    default: false
                },
                {
                    type: 'checkbox',
                    id: 'lowLatency',
                    label: 'Enable Low Latency',
                    default: false
                },
                {
                    type: 'dropdown',
					id: 'output',
					label: 'Output Resolution',
					default: '1080P60',
					choices: [
						{ id: '1080P60', label: '1080P60' },
						{ id: '1080I60', label: '1080I60' },
						{ id: '1080P50', label: '1080P50' },
                        { id: '1080I50', label: '1080I50' },
                        { id: '1080P30', label: '1080P30' },
                        { id: '720P60', label: '720P60' },
                        { id: '720P50', label: '720P50' },
					],
                },
                 {
                    type: 'dropdown',
					id: 'rotate',
					label: 'Rotation',
					default: 0,
                    choices: [
                        { id: 0, label: '0' },
                        { id: 90, label: '90' },
                        { id: 180, label: '180' },
                        { id: 270, label: '270' }
                    ]
                },
                 {
                    type: 'number',
                    id: 'src',
                    label: 'Output Source',
                    min: 0,
                    default: 0
                 },
                  {
                    type: 'checkbox',
                    id: 'ui',
                    label: 'Enable UI Output',
                    default: false
                },
                {
                    type: 'checkbox',
                    id: 'enable2',
                    label: 'Enable VGA Output',
                    default: false
                },
                 {
                    type: 'checkbox',
                    id: 'lowLatency2',
                    label: 'Enable Low Latency VGA Output',
                    default: false
                },
                  {
                    type: 'dropdown',
					id: 'output2',
					label: 'VGA Output Resolution',
					default: '1080P60',
					choices: [
						{ id: '1080P60', label: '1080P60' },
						{ id: '1080I60', label: '1080I60' },
						{ id: '1080P50', label: '1080P50' },
                        { id: '1080I50', label: '1080I50' },
                        { id: '1080P30', label: '1080P30' },
                        { id: '720P60', label: '720P60' },
                        { id: '720P50', label: '720P50' },
					],
                },
                 {
                    type: 'dropdown',
					id: 'rotate2',
					label: 'VGA Rotation',
					default: 0,
                    choices: [
                        { id: 0, label: '0' },
                        { id: 90, label: '90' },
                        { id: 180, label: '180' },
                        { id: 270, label: '270' }
                    ]
                },
                  {
                    type: 'number',
                    id: 'src2',
                    label: 'VGA Output Source',
                     min: 0,
                    default: 0
                 },
                   {
                    type: 'checkbox',
                    id: 'ui2',
                    label: 'Enable UI Output on VGA',
                    default: false
                }
            ],
            callback: async(event) => {
                const { enable, lowLatency, output, rotate, src, ui, enable2, lowLatency2, output2, rotate2, src2, ui2 } = event.options
                await self.setOutputConfs(enable, lowLatency, output, rotate, src, ui, enable2, lowLatency2, output2, rotate2, src2, ui2)
            }
        },
		set_record_confs: {
			name: 'Set Recording Configuration',
			options: [
				{
					type: 'textinput',
					id: 'chns',
					label: 'Recording Channel IDs (comma separated)',
				},
				{
					type: 'checkbox',
					id: 'mp4',
					label: 'Enable MP4 Recording',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'flv',
					label: 'Enable FLV Recording',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'mkv',
					label: 'Enable MKV Recording',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'mov',
					label: 'Enable MOV Recording',
					default: false,
				},
				{
					type: 'checkbox',
					id: 'ts',
					label: 'Enable TS Recording',
					default: false,
				},
			],
			callback: async (event) => {
				const { chns, mp4, flv, mkv, mov, ts } = event.options
				await self.setRecordConfs(chns, mp4, flv, mkv, mov, ts)
			},
		},
		start_rec: {
			name: 'Start Recording',
			options: [],
			callback: async (event) => {
				await self.startRec()
			},
		},
		stop_rec: {
			name: 'Stop Recording',
			options: [],
			callback: async (event) => {
				await self.stopRec()
			},
		},
  };
}