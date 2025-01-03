const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
	self.setPresetDefinitions({
		start_encoding: {
			type: 'button',
			category: 'Encoding',
			name: 'Start Encoding',
			style: {
				text: 'Start Encoding',
				size: '18',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
            options: {},
			steps: [
				{
					down: [
						{
							actionId: 'start_encode',
						},
					],
					up: [],
				},
			],
		},
		stop_encoding: {
			type: 'button',
			category: 'Encoding',
			name: 'Stop Encoding',
			style: {
				text: 'Stop Encoding',
				size: '18',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 0, 0),
			},
            options: {},
			steps: [
				{
					down: [
						{
							actionId: 'stop_encode',
						},
					],
					up: [],
				},
			],
		},
		reboot_encoder: {
			type: 'button',
			category: 'System',
			name: 'Reboot Encoder',
			style: {
				text: 'Reboot Encoder',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
            options: {},
			steps: [
				{
					down: [
						{
							actionId: 'reboot_encoder',
						},
					],
					up: [],
				},
			],
		},
        start_platform_lives: {
			type: 'button',
			category: 'Streaming',
			name: 'Start Multi-platform Live Streaming',
			style: {
				text: 'Start Multi-platform Live Streaming',
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
            options: {},
			steps: [
				{
					down: [
						{
							actionId: 'start_platform_lives',
						},
					],
					up: [],
				},
			],
		},
		stop_platform_lives: {
			type: 'button',
			category: 'Streaming',
			name: 'Stop Multi-platform Live Streaming',
			style: {
				text: 'Stop Multi-platform Live Streaming',
				size: '14',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 0, 0),
			},
             options: {},
			steps: [
				{
					down: [
						{
							actionId: 'stop_platform_lives',
						},
					],
					up: [],
				},
			],
		},
        start_rec: {
			type: 'button',
			category: 'Recording',
			name: 'Start Recording',
			style: {
				text: 'Start Recording',
				size: '18',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(0, 255, 0),
			},
             options: {},
			steps: [
				{
					down: [
						{
							actionId: 'start_rec',
						},
					],
					up: [],
				},
			],
		},
		stop_rec: {
			type: 'button',
			category: 'Recording',
			name: 'Stop Recording',
			style: {
				text: 'Stop Recording',
				size: '18',
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(255, 0, 0),
			},
            options: {},
			steps: [
				{
					down: [
						{
							actionId: 'stop_rec',
						},
					],
					up: [],
				},
			],
		},
	})
}