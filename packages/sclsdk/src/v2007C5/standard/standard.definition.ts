export const DEFINITION = {
	SCL: {
		tag: 'SCL',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['release', 'revision', 'version'],
			details: {
				release: {
					type: 'unsignedByte',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				revision: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				version: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Header',
				'Substation',
				'Communication',
				'IED',
				'DataTypeTemplates',
				'Line',
				'Process',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Header: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				Substation: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Communication: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				IED: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				DataTypeTemplates: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Line: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Process: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Text: {
		tag: 'Text',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['source'],
			details: {
				source: {
					type: 'anyURI',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tText',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Private: {
		tag: 'Private',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['source', 'type'],
			details: {
				source: {
					type: 'anyURI',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tPrivate',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Header: {
		tag: 'Header',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'id',
				'version',
				'revision',
				'toolID',
				'nameStructure',
				'fileType',
				'uuid',
				'baseUuid',
			],
			details: {
				id: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				version: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				revision: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				toolID: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				nameStructure: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'IEDName',
				},
				fileType: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				baseUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'History', 'SourceFiles'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				History: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SourceFiles: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tHeader',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	History: {
		tag: 'History',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: ['Hitem'],
			details: {
				Hitem: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Hitem: {
		tag: 'Hitem',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['revision', 'version', 'what', 'when', 'who', 'why'],
			details: {
				revision: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				version: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				what: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				when: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				who: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				why: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['SourceFiles'],
			details: {
				SourceFiles: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tHitem',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SourceFiles: {
		tag: 'SourceFiles',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'SclFileReference'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SclFileReference: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tHeaderSclRef',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SclFileReference: {
		tag: 'SclFileReference',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'fileName', 'fileType', 'fileUuid', 'revision', 'version', 'when'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				fileName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				fileType: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				fileUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				revision: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				version: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				when: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSclFileUUIDReference',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Substation: {
		tag: 'Substation',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'PowerTransformer',
				'GeneralEquipment',
				'VoltageLevel',
				'Function',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				PowerTransformer: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				VoltageLevel: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				Function: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSubstation',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Labels: {
		tag: 'Labels',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Label'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Label: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLabels',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Label: {
		tag: 'Label',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['id', 'lang'],
			details: {
				id: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lang: {
					type: 'language',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLabel',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	LNode: {
		tag: 'LNode',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'desc',
				'iedName',
				'ldInst',
				'lnClass',
				'lnInst',
				'lnType',
				'lnUuid',
				'prefix',
				'templateUuid',
				'uuid',
			],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				iedName: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'None',
				},
				ldInst: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnInst: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lnType: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLNode',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	PowerTransformer: {
		tag: 'PowerTransformer',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid', 'virtual'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				virtual: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'TransformerWinding',
				'SubEquipment',
				'EqFunction',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				TransformerWinding: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				SubEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EqFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tPowerTransformer',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	TransformerWinding: {
		tag: 'TransformerWinding',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid', 'virtual'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				virtual: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'Terminal',
				'SubEquipment',
				'TapChanger',
				'NeutralPoint',
				'EqFunction',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Terminal: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 2,
				},
				SubEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				TapChanger: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				NeutralPoint: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				EqFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tTransformerWinding',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Terminal: {
		tag: 'Terminal',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'bayName',
				'cNodeName',
				'cNodeUuid',
				'connectivityNode',
				'desc',
				'lineName',
				'name',
				'processName',
				'substationName',
				'voltageLevelName',
			],
			details: {
				bayName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				cNodeName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				cNodeUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				connectivityNode: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lineName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				processName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				substationName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				voltageLevelName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tTerminal',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SubEquipment: {
		tag: 'SubEquipment',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'phase', 'templateUuid', 'uuid', 'virtual'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				phase: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'none',
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				virtual: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'LNode', 'EqFunction'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EqFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSubEquipment',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	EqFunction: {
		tag: 'EqFunction',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'LNode', 'GeneralEquipment', 'EqSubFunction'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EqSubFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tEqFunction',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GeneralEquipment: {
		tag: 'GeneralEquipment',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid', 'virtual'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				virtual: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'LNode', 'EqFunction'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EqFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tGeneralEquipment',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	EqSubFunction: {
		tag: 'EqSubFunction',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'LNode', 'GeneralEquipment', 'EqSubFunction'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EqSubFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tEqSubFunction',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	TapChanger: {
		tag: 'TapChanger',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid', 'virtual'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				virtual: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'LNode', 'SubEquipment', 'EqFunction'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SubEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EqFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tTapChanger',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	NeutralPoint: {
		tag: 'NeutralPoint',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'bayName',
				'cNodeName',
				'cNodeUuid',
				'connectivityNode',
				'desc',
				'lineName',
				'name',
				'processName',
				'substationName',
				'voltageLevelName',
			],
			details: {
				bayName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				cNodeName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				cNodeUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				connectivityNode: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lineName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				processName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				substationName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				voltageLevelName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tTerminal',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	VoltageLevel: {
		tag: 'VoltageLevel',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'nomFreq', 'numPhases', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				nomFreq: {
					type: 'decimal',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				numPhases: {
					type: 'unsignedByte',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'PowerTransformer',
				'GeneralEquipment',
				'Voltage',
				'Bay',
				'Function',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				PowerTransformer: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Voltage: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Bay: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				Function: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tVoltageLevel',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Voltage: {
		tag: 'Voltage',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['unit', 'multiplier'],
			details: {
				unit: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				multiplier: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tVoltage',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Bay: {
		tag: 'Bay',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'PowerTransformer',
				'GeneralEquipment',
				'ConductingEquipment',
				'ConnectivityNode',
				'Function',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				PowerTransformer: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ConductingEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ConnectivityNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Function: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tBay',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConductingEquipment: {
		tag: 'ConductingEquipment',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid', 'virtual'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				virtual: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'LNode', 'Terminal', 'SubEquipment', 'EqFunction'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Terminal: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 2,
				},
				SubEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EqFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tConductingEquipment',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConnectivityNode: {
		tag: 'ConnectivityNode',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'pathName', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				pathName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'LNode'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tConnectivityNode',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Function: {
		tag: 'Function',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'SubFunction',
				'GeneralEquipment',
				'ConductingEquipment',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SubFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ConductingEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tFunction',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SubFunction: {
		tag: 'SubFunction',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'GeneralEquipment',
				'ConductingEquipment',
				'SubFunction',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ConductingEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SubFunction: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSubFunction',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Communication: {
		tag: 'Communication',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'SubNetwork'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SubNetwork: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tCommunication',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SubNetwork: {
		tag: 'SubNetwork',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'BitRate', 'ConnectedAP'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				BitRate: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConnectedAP: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSubNetwork',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	BitRate: {
		tag: 'BitRate',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['unit', 'multiplier'],
			details: {
				unit: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				multiplier: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tBitRateInMbPerSec',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConnectedAP: {
		tag: 'ConnectedAP',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['apName', 'apUuid', 'desc', 'iedName', 'redProt'],
			details: {
				apName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				apUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				iedName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				redProt: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Address', 'GSE', 'SMV', 'PhysConn'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Address: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GSE: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SMV: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				PhysConn: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tConnectedAP',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Address: {
		tag: 'Address',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: ['P'],
			details: {
				P: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tAddress',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	P: {
		tag: 'P',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['type'],
			details: {
				type: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tP',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GSE: {
		tag: 'GSE',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['cbName', 'cbUuid', 'desc', 'ldInst'],
			details: {
				cbName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				cbUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Address', 'MinTime', 'MaxTime'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Address: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				MinTime: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				MaxTime: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tGSE',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	MinTime: {
		tag: 'MinTime',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['unit', 'multiplier'],
			details: {
				unit: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				multiplier: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDurationInMilliSec',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	MaxTime: {
		tag: 'MaxTime',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['unit', 'multiplier'],
			details: {
				unit: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				multiplier: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDurationInMilliSec',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SMV: {
		tag: 'SMV',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['cbName', 'cbUuid', 'desc', 'ldInst'],
			details: {
				cbName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				cbUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Address'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Address: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSMV',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	PhysConn: {
		tag: 'PhysConn',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'type'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				type: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'P'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				P: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tPhysConn',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	IED: {
		tag: 'IED',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'configVersion',
				'desc',
				'engRight',
				'manufacturer',
				'name',
				'originalSclRelease',
				'originalSclRevision',
				'originalSclVersion',
				'owner',
				'templateUuid',
				'type',
				'uuid',
			],
			details: {
				configVersion: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				engRight: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'full',
				},
				manufacturer: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				originalSclRelease: {
					type: 'unsignedByte',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '1',
				},
				originalSclRevision: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'A',
				},
				originalSclVersion: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '2003',
				},
				owner: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Services',
				'AccessPoint',
				'KDC',
				'IEDSourceFiles',
				'MinRequestedSCDFiles',
				'Labels',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Services: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				AccessPoint: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				KDC: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				IEDSourceFiles: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				MinRequestedSCDFiles: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tIED',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Services: {
		tag: 'Services',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['nameLength'],
			details: {
				nameLength: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '32',
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'DynAssociation',
				'SettingGroups',
				'GetDirectory',
				'GetDataObjectDefinition',
				'DataObjectDirectory',
				'GetDataSetValue',
				'SetDataSetValue',
				'DataSetDirectory',
				'ConfDataSet',
				'DynDataSet',
				'ReadWrite',
				'TimerActivatedControl',
				'ConfReportControl',
				'GetCBValues',
				'ConfLogControl',
				'ReportSettings',
				'LogSettings',
				'GSESettings',
				'SMVSettings',
				'GSEDir',
				'GOOSE',
				'GSSE',
				'SMVsc',
				'FileHandling',
				'ConfLNs',
				'ClientServices',
				'ConfLdName',
				'SupSubscription',
				'ConfSigRef',
				'ValueHandling',
				'RedProt',
				'TimeSyncProt',
				'CommProt',
				'SCSM',
				'Security',
				'MultiAPPerSubNet',
			],
			details: {
				DynAssociation: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SettingGroups: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GetDirectory: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GetDataObjectDefinition: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				DataObjectDirectory: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GetDataSetValue: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SetDataSetValue: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				DataSetDirectory: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConfDataSet: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				DynDataSet: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ReadWrite: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				TimerActivatedControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConfReportControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GetCBValues: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConfLogControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ReportSettings: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LogSettings: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GSESettings: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SMVSettings: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GSEDir: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GOOSE: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GSSE: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SMVsc: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				FileHandling: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConfLNs: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ClientServices: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConfLdName: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SupSubscription: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConfSigRef: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ValueHandling: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				RedProt: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				TimeSyncProt: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				CommProt: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SCSM: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Security: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				MultiAPPerSubNet: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServices',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DynAssociation: {
		tag: 'DynAssociation',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceWithOptionalMax',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SettingGroups: {
		tag: 'SettingGroups',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: ['SGEdit', 'ConfSG'],
			details: {
				SGEdit: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConfSG: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSettingGroups',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SGEdit: {
		tag: 'SGEdit',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['resvTms'],
			details: {
				resvTms: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConfSG: {
		tag: 'ConfSG',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['resvTms'],
			details: {
				resvTms: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GetDirectory: {
		tag: 'GetDirectory',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GetDataObjectDefinition: {
		tag: 'GetDataObjectDefinition',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DataObjectDirectory: {
		tag: 'DataObjectDirectory',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GetDataSetValue: {
		tag: 'GetDataSetValue',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SetDataSetValue: {
		tag: 'SetDataSetValue',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DataSetDirectory: {
		tag: 'DataSetDirectory',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConfDataSet: {
		tag: 'ConfDataSet',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max', 'maxAttributes', 'modify'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				maxAttributes: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				modify: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceForConfDataSet',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DynDataSet: {
		tag: 'DynDataSet',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max', 'maxAttributes'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				maxAttributes: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceWithMaxAndMaxAttributes',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ReadWrite: {
		tag: 'ReadWrite',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	TimerActivatedControl: {
		tag: 'TimerActivatedControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConfReportControl: {
		tag: 'ConfReportControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max', 'bufMode', 'bufConf', 'maxBuf'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				bufMode: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'both',
				},
				bufConf: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				maxBuf: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceConfReportControl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GetCBValues: {
		tag: 'GetCBValues',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConfLogControl: {
		tag: 'ConfLogControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceWithMaxNonZero',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ReportSettings: {
		tag: 'ReportSettings',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'cbName',
				'datSet',
				'rptID',
				'optFields',
				'bufTime',
				'trgOps',
				'intgPd',
				'resvTms',
				'owner',
			],
			details: {
				cbName: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				datSet: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				rptID: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				optFields: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				bufTime: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				trgOps: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				intgPd: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				resvTms: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				owner: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tReportSettings',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	LogSettings: {
		tag: 'LogSettings',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['cbName', 'datSet', 'logEna', 'trgOps', 'intgPd'],
			details: {
				cbName: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				datSet: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				logEna: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				trgOps: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				intgPd: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLogSettings',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GSESettings: {
		tag: 'GSESettings',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['cbName', 'datSet', 'appID', 'dataLabel', 'kdaParticipant'],
			details: {
				cbName: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				datSet: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				appID: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				dataLabel: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				kdaParticipant: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: ['McSecurity'],
			details: {
				McSecurity: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tGSESettings',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	McSecurity: {
		tag: 'McSecurity',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['signature', 'encryption'],
			details: {
				signature: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				encryption: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tMcSecurity',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SMVSettings: {
		tag: 'SMVSettings',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'cbName',
				'datSet',
				'svID',
				'optFields',
				'smpRate',
				'samplesPerSec',
				'pdcTimeStamp',
				'synchSrcId',
				'nofASDU',
				'kdaParticipant',
			],
			details: {
				cbName: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				datSet: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				svID: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				optFields: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				smpRate: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				samplesPerSec: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				pdcTimeStamp: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				synchSrcId: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				nofASDU: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Fix',
				},
				kdaParticipant: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: ['SmpRate', 'SamplesPerSec', 'SecPerSamples', 'McSecurity'],
			details: {
				SmpRate: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				SamplesPerSec: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				SecPerSamples: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				McSecurity: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSMVSettings',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SmpRate: {
		tag: 'SmpRate',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SamplesPerSec: {
		tag: 'SamplesPerSec',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SecPerSamples: {
		tag: 'SecPerSamples',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GSEDir: {
		tag: 'GSEDir',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GOOSE: {
		tag: 'GOOSE',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max', 'fixedOffs', 'goose', 'rGOOSE'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				fixedOffs: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				goose: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				rGOOSE: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tGOOSEcapabilities',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GSSE: {
		tag: 'GSSE',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceWithMax',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SMVsc: {
		tag: 'SMVsc',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max', 'delivery', 'deliveryConf', 'sv', 'rSV'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				delivery: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'multicast',
				},
				deliveryConf: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				sv: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				rSV: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSMVsc',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	FileHandling: {
		tag: 'FileHandling',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['mms', 'ftp', 'ftps'],
			details: {
				mms: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				ftp: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				ftps: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tFileHandling',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConfLNs: {
		tag: 'ConfLNs',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['fixPrefix', 'fixLnInst'],
			details: {
				fixPrefix: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				fixLnInst: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tConfLNs',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ClientServices: {
		tag: 'ClientServices',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'goose',
				'gsse',
				'bufReport',
				'unbufReport',
				'readLog',
				'sv',
				'supportsLdName',
				'maxAttributes',
				'maxReports',
				'maxGOOSE',
				'maxSMV',
				'rGOOSE',
				'rSV',
				'noIctBinding',
				'acceptServerInitiatedAssociation',
			],
			details: {
				goose: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				gsse: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				bufReport: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				unbufReport: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				readLog: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				sv: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				supportsLdName: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				maxAttributes: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				maxReports: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				maxGOOSE: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				maxSMV: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				rGOOSE: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				rSV: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				noIctBinding: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				acceptServerInitiatedAssociation: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: ['TimeSyncProt', 'GOOSEMcSecurity', 'SVMcSecurity', 'Security'],
			details: {
				TimeSyncProt: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GOOSEMcSecurity: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				SVMcSecurity: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Security: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tClientServices',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	TimeSyncProt: {
		tag: 'TimeSyncProt',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['sntp', 'iec61850_9_3', 'c37_238', 'other'],
			details: {
				sntp: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				iec61850_9_3: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				c37_238: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				other: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tTimeSyncProt',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GOOSEMcSecurity: {
		tag: 'GOOSEMcSecurity',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['signature', 'encryption'],
			details: {
				signature: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				encryption: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tMcSecurity',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SVMcSecurity: {
		tag: 'SVMcSecurity',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['signature', 'encryption'],
			details: {
				signature: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				encryption: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tMcSecurity',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Security: {
		tag: 'Security',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['ACSEAuthentication', 'E2ESecurity'],
			details: {
				ACSEAuthentication: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				E2ESecurity: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSecurity',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConfLdName: {
		tag: 'ConfLdName',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SupSubscription: {
		tag: 'SupSubscription',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['maxGo', 'maxSv'],
			details: {
				maxGo: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				maxSv: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSupSubscription',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ConfSigRef: {
		tag: 'ConfSigRef',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['max'],
			details: {
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceWithMaxNonZero',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ValueHandling: {
		tag: 'ValueHandling',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['setToRO'],
			details: {
				setToRO: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tValueHandling',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	RedProt: {
		tag: 'RedProt',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['hsr', 'prp', 'rstp'],
			details: {
				hsr: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				prp: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				rstp: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tRedProt',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	CommProt: {
		tag: 'CommProt',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['ipv6'],
			details: {
				ipv6: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tCommProt',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SCSM: {
		tag: 'SCSM',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['iec61850_8_1', 'iec61850_8_2', 'serverAssociationInitiation'],
			details: {
				iec61850_8_1: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				iec61850_8_2: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				serverAssociationInitiation: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSCSM',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	MultiAPPerSubNet: {
		tag: 'MultiAPPerSubNet',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServiceYesNo',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	AccessPoint: {
		tag: 'AccessPoint',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['clock', 'desc', 'kdc', 'name', 'router', 'templateUuid', 'uuid'],
			details: {
				clock: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				kdc: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				router: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Server',
				'LN',
				'ServerAt',
				'Services',
				'GOOSESecurity',
				'SMVSecurity',
				'Labels',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Server: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				LN: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				ServerAt: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				Services: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GOOSESecurity: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 7,
				},
				SMVSecurity: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 7,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tAccessPoint',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Server: {
		tag: 'Server',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'timeout'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				timeout: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '30',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Authentication', 'LDevice', 'Association'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Authentication: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				LDevice: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				Association: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServer',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Authentication: {
		tag: 'Authentication',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['none', 'password', 'weak', 'strong', 'certificate'],
			details: {
				none: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				password: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				weak: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				strong: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				certificate: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	LDevice: {
		tag: 'LDevice',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'inst', 'ldName', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				inst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				ldName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'LN0', 'LN', 'AccessControl', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				LN0: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				LN: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				AccessControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLDevice',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	LN0: {
		tag: 'LN0',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'inst', 'lnClass', 'lnType', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				inst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnType: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'DataSet',
				'ReportControl',
				'LogControl',
				'DOI',
				'Inputs',
				'Outputs',
				'Log',
				'Labels',
				'GSEControl',
				'SampledValueControl',
				'SettingControl',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				DataSet: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ReportControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				LogControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				DOI: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Inputs: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Outputs: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Log: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				GSEControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SampledValueControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SettingControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DataSet: {
		tag: 'DataSet',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'FCDA'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				FCDA: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDataSet',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	FCDA: {
		tag: 'FCDA',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'ldInst',
				'prefix',
				'lnClass',
				'lnInst',
				'doName',
				'daName',
				'fc',
				'ix',
				'lnUuid',
			],
			details: {
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				doName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				daName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				fc: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				ix: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tFCDA',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ReportControl: {
		tag: 'ReportControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'bufTime',
				'buffered',
				'confRev',
				'datSet',
				'desc',
				'indexed',
				'intgPd',
				'name',
				'rptID',
				'templateUuid',
				'uuid',
			],
			details: {
				bufTime: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '0',
				},
				buffered: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				confRev: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				datSet: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				indexed: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				intgPd: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '0',
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				rptID: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'TrgOps', 'OptFields', 'RptEnabled'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				TrgOps: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				OptFields: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				RptEnabled: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tReportControl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	TrgOps: {
		tag: 'TrgOps',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['dchg', 'qchg', 'dupd', 'period', 'gi'],
			details: {
				dchg: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				qchg: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				dupd: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				period: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				gi: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tTrgOps',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	OptFields: {
		tag: 'OptFields',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'seqNum',
				'timeStamp',
				'dataSet',
				'reasonCode',
				'dataRef',
				'entryID',
				'configRef',
				'bufOvfl',
			],
			details: {
				seqNum: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				timeStamp: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				dataSet: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				reasonCode: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				dataRef: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				entryID: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				configRef: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				bufOvfl: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	RptEnabled: {
		tag: 'RptEnabled',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'max'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				max: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '1',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'ClientLN'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ClientLN: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tRptEnabled',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ClientLN: {
		tag: 'ClientLN',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['desc', 'iedName', 'ldInst', 'prefix', 'lnClass', 'lnInst', 'lnUuid', 'apRef'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				iedName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnInst: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				apRef: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tClientLN',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	LogControl: {
		tag: 'LogControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'bufTime',
				'datSet',
				'desc',
				'intgPd',
				'ldInst',
				'lnClass',
				'lnInst',
				'logEna',
				'logName',
				'name',
				'prefix',
				'reasonCode',
				'templateUuid',
				'uuid',
			],
			details: {
				bufTime: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '0',
				},
				datSet: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				intgPd: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '0',
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'LLN0',
				},
				lnInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				logEna: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				logName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				reasonCode: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'TrgOps'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				TrgOps: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLogControl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DOI: {
		tag: 'DOI',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['accessControl', 'desc', 'ix', 'name'],
			details: {
				accessControl: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				ix: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'SDI', 'DAI', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SDI: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				DAI: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDOI',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SDI: {
		tag: 'SDI',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'ix', 'name', 'sAddr'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				ix: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				name: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				sAddr: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'SDI', 'DAI', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SDI: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				DAI: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSDI',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DAI: {
		tag: 'DAI',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'ix', 'name', 'sAddr', 'valImport', 'valKind'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				ix: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				name: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				sAddr: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				valImport: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				valKind: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Val', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Val: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDAI',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Val: {
		tag: 'Val',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['sGroup'],
			details: {
				sGroup: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tVal',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Inputs: {
		tag: 'Inputs',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'ExtRef'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ExtRef: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tInputs',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ExtRef: {
		tag: 'ExtRef',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'daName',
				'desc',
				'doName',
				'iedName',
				'intAddr',
				'ldInst',
				'lnClass',
				'lnInst',
				'lnUuid',
				'pDA',
				'pDO',
				'pLN',
				'pServT',
				'prefix',
				'serviceType',
				'srcCBName',
				'srcCBUuid',
				'srcLDInst',
				'srcLNClass',
				'srcLNInst',
				'srcPrefix',
				'templateUuid',
				'uuid',
			],
			details: {
				daName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				doName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				iedName: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				intAddr: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				pDA: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				pDO: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				pLN: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				pServT: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				serviceType: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				srcCBName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				srcCBUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				srcLDInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				srcLNClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				srcLNInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				srcPrefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tExtRef',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Outputs: {
		tag: 'Outputs',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'ExtCtrl'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ExtCtrl: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tOutputs',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ExtCtrl: {
		tag: 'ExtCtrl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'apRef',
				'checkInterlock',
				'checkSynchrocheck',
				'desc',
				'doName',
				'iedName',
				'intAddr',
				'ldInst',
				'lnClass',
				'lnInst',
				'lnUuid',
				'pDO',
				'pLN',
				'prefix',
				'templateUuid',
				'uuid',
			],
			details: {
				apRef: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				checkInterlock: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				checkSynchrocheck: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				doName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				iedName: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				intAddr: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				pDO: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				pLN: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tExtCtrl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Log: {
		tag: 'Log',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLog',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GSEControl: {
		tag: 'GSEControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'appID',
				'confRev',
				'datSet',
				'desc',
				'fixedOffs',
				'name',
				'securityEnable',
				'templateUuid',
				'type',
				'uuid',
			],
			details: {
				appID: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				confRev: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				datSet: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				fixedOffs: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				securityEnable: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'None',
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'GOOSE',
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'IEDName', 'Protocol'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				IEDName: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Protocol: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tGSEControl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	IEDName: {
		tag: 'IEDName',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['apRef', 'ldInst', 'prefix', 'lnClass', 'lnInst', 'apUuid', 'ldUuid', 'lnUuid'],
			details: {
				apRef: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				apUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				ldUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				lnUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Protocol: {
		tag: 'Protocol',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['mustUnderstand'],
			details: {
				mustUnderstand: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tProtocol',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SampledValueControl: {
		tag: 'SampledValueControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'confRev',
				'datSet',
				'desc',
				'multicast',
				'name',
				'nofASDU',
				'securityEnable',
				'smpMod',
				'smpRate',
				'smvID',
				'templateUuid',
				'uuid',
			],
			details: {
				confRev: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				datSet: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				multicast: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'true',
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				nofASDU: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				securityEnable: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'None',
				},
				smpMod: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'SmpPerPeriod',
				},
				smpRate: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				smvID: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'IEDName', 'SmvOpts', 'Protocol'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				IEDName: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SmvOpts: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				Protocol: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSampledValueControl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SmvOpts: {
		tag: 'SmvOpts',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'refreshTime',
				'sampleSynchronized',
				'sampleRate',
				'dataSet',
				'security',
				'timestamp',
				'synchSourceId',
				'sampleMode',
			],
			details: {
				refreshTime: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				sampleSynchronized: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				sampleRate: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				dataSet: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				security: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				timestamp: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				synchSourceId: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				sampleMode: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SettingControl: {
		tag: 'SettingControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['actSG', 'desc', 'numOfSGs', 'resvTms'],
			details: {
				actSG: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '1',
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				numOfSGs: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				resvTms: {
					type: 'unsignedShort',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSettingControl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	LN: {
		tag: 'LN',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'inst', 'lnClass', 'lnType', 'prefix', 'templateUuid', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				inst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnType: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'DataSet',
				'ReportControl',
				'LogControl',
				'DOI',
				'Inputs',
				'Outputs',
				'Log',
				'Labels',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				DataSet: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ReportControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				LogControl: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				DOI: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Inputs: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Outputs: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Log: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLN',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	AccessControl: {
		tag: 'AccessControl',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tAccessControl',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Association: {
		tag: 'Association',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [
				'desc',
				'iedName',
				'ldInst',
				'prefix',
				'lnClass',
				'lnInst',
				'lnUuid',
				'apRef',
				'kind',
				'associationID',
				'initiator',
			],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				iedName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				ldInst: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				prefix: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnInst: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				lnUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				apRef: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				kind: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				associationID: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				initiator: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'client',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tAssociation',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ServerAt: {
		tag: 'ServerAt',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['apName', 'apUuid', 'desc'],
			details: {
				apName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				apUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tServerAt',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	GOOSESecurity: {
		tag: 'GOOSESecurity',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'serialNumber', 'templateUuid', 'uuid', 'xferNumber'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				serialNumber: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				xferNumber: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'Subject', 'IssuerName'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Subject: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				IssuerName: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tCertificate',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Subject: {
		tag: 'Subject',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['commonName', 'idHierarchy'],
			details: {
				commonName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				idHierarchy: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tCert',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	IssuerName: {
		tag: 'IssuerName',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['commonName', 'idHierarchy'],
			details: {
				commonName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				idHierarchy: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tCert',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SMVSecurity: {
		tag: 'SMVSecurity',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'serialNumber', 'templateUuid', 'uuid', 'xferNumber'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				serialNumber: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				xferNumber: {
					type: 'unsignedInt',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels', 'Subject', 'IssuerName'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Subject: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				IssuerName: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tCertificate',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	KDC: {
		tag: 'KDC',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['iedName', 'apName', 'apUuid'],
			details: {
				iedName: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				apName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				apUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tKDC',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	IEDSourceFiles: {
		tag: 'IEDSourceFiles',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'SclFileReference'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SclFileReference: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tIEDSclRef',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	MinRequestedSCDFiles: {
		tag: 'MinRequestedSCDFiles',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'MinRequestedSCDFile'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				MinRequestedSCDFile: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tMinRequestedSCDFiles',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	MinRequestedSCDFile: {
		tag: 'MinRequestedSCDFile',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'fileName', 'fileType', 'fileUuid', 'revision', 'version', 'when'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				fileName: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				fileType: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				fileUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				revision: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				version: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				when: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tMinRequestedSCDFile',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DataTypeTemplates: {
		tag: 'DataTypeTemplates',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: [],
			details: {},
		},
		subElements: {
			any: false,
			available: ['LNodeType', 'DOType', 'DAType', 'EnumType'],
			details: {
				LNodeType: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				DOType: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				DAType: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EnumType: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDataTypeTemplates',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	LNodeType: {
		tag: 'LNodeType',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'id', 'iedType', 'lnClass'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				id: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				iedType: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				lnClass: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'DO', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				DO: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLNodeType',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DO: {
		tag: 'DO',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['accessControl', 'desc', 'name', 'transient', 'type'],
			details: {
				accessControl: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				transient: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDO',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DOType: {
		tag: 'DOType',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['cdc', 'desc', 'id', 'iedType'],
			details: {
				cdc: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				id: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				iedType: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'SDO', 'DA', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				SDO: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				DA: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: 1,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDOType',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	SDO: {
		tag: 'SDO',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['count', 'desc', 'name', 'type'],
			details: {
				count: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '0',
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'Name',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tSDO',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DA: {
		tag: 'DA',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: [
				'bType',
				'count',
				'dchg',
				'desc',
				'dupd',
				'fc',
				'name',
				'qchg',
				'sAddr',
				'type',
				'valImport',
				'valKind',
			],
			details: {
				bType: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				count: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '0',
				},
				dchg: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				dupd: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				fc: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				name: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				qchg: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				sAddr: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				valImport: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				valKind: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Set',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Val', 'Labels', 'ProtNs'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Val: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ProtNs: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDA',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	ProtNs: {
		tag: 'ProtNs',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['type'],
			details: {
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '8-MMS',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tProtNs',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	DAType: {
		tag: 'DAType',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'id', 'iedType'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				id: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				iedType: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'BDA', 'ProtNs', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				BDA: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				ProtNs: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tDAType',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	BDA: {
		tag: 'BDA',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['bType', 'count', 'desc', 'name', 'sAddr', 'type', 'valImport', 'valKind'],
			details: {
				bType: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				count: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '0',
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'union',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				sAddr: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				valImport: {
					type: 'boolean',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'false',
				},
				valKind: {
					type: 'enum',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: 'Set',
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'Val', 'Labels'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Val: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tBDA',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	EnumType: {
		tag: 'EnumType',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'id'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				id: {
					type: 'token',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: ['Text', 'Private', 'EnumVal'],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				EnumVal: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tEnumType',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	EnumVal: {
		tag: 'EnumVal',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: false,
			available: ['ord', 'desc'],
			details: {
				ord: {
					type: 'int',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
			},
		},
		subElements: {
			any: false,
			available: [],
			details: {},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tEnumVal',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Line: {
		tag: 'Line',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'nomFreq', 'numPhases', 'templateUuid', 'type', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				nomFreq: {
					type: 'decimal',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				numPhases: {
					type: 'unsignedByte',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'GeneralEquipment',
				'Function',
				'Voltage',
				'ConductingEquipment',
				'ConnectivityNode',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Function: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Voltage: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				ConductingEquipment: {
					required: true,
					minOccurrence: 1,
					maxOccurrence: null,
				},
				ConnectivityNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tLine',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
	Process: {
		tag: 'Process',
		namespace: {
			uri: 'http://www.iec.ch/61850/2003/SCL',
			prefix: 'scl',
		},
		attributes: {
			any: true,
			available: ['desc', 'name', 'templateUuid', 'type', 'uuid'],
			details: {
				desc: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: '',
				},
				name: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: true,
					default: null,
				},
				templateUuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				type: {
					type: 'normalizedString',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
				uuid: {
					type: 'string',
					namespace: {
						uri: '',
						prefix: '',
					},
					required: false,
					default: null,
				},
			},
		},
		subElements: {
			any: false,
			available: [
				'Text',
				'Private',
				'Labels',
				'LNode',
				'GeneralEquipment',
				'Function',
				'ConductingEquipment',
				'Substation',
				'Line',
				'Process',
			],
			details: {
				Text: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				Private: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Labels: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: 1,
				},
				LNode: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				GeneralEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Function: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				ConductingEquipment: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Substation: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Line: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
				Process: {
					required: false,
					minOccurrence: 0,
					maxOccurrence: null,
				},
			},
		},
		validation: {
			value: {
				type_name: '{http://www.iec.ch/61850/2003/SCL}tProcess',
			},
			uniqueness: {
				name: '',
				tagNames: [],
				attributes: [],
			},
		},
	},
} as const
