1. create Substation / VoltageLevel / Function / SubFunction / LNode dropdowns as LNodeOne
2. create Substation / VoltageLevel / Function / SubFunction / LNode dropdowns as LNodeTwo
3. create a dataflow type with two dropdowns :

```ts
const dataflowType: 'senderReceiver' | 'controllerControlled'
const service: GOOSE | SMV | Reporting | Internal | Wired // linked to 'senderReceiver' dataflowType
```

4. create a dropdown to select a <DO> or <DO>.<SDO>

```ts
const dropdownDO: {
	label: DO.name || `${DO.name}.${SDO.name}` || ... ?
	value: DO.id // should it be SDO.id in case of a subData Object ?
}
```

5. create a dropdown to select a <DA> or <DA>.<BDA> or <DA>.etc

```ts
const dropdownDA: {
	label: DA.name || `${DA.name}.${BDA.name}` || ... ?
	value: DA.id // should it be BDA.id in case of a subData Object ?
}
```

```ts
// case sensitive keys
const FUNCTIONAL_CONSTRAINT = {
	st: 'ST',
	mx: 'MX',
	sp: 'SP',
	sv: 'SV',
	cf: 'CF',
	dc: 'DC',
	sg: 'SG',
	se: 'SE',
	sr: 'SR',
	or: 'OR',
	bl: 'BL',
	ex: 'EX',
} as const

const AUTHORIZED_FUNCTIONAL_CONSTRAINTS_PER_SERVICES = {
	GOOSE: [
		FUNCTIONAL_CONSTRAINT.st,
		FUNCTIONAL_CONSTRAINT.mx,
		FUNCTIONAL_CONSTRAINT.sp,
		FUNCTIONAL_CONSTRAINT.or,
	],
	SMV: [FUNCTIONAL_CONSTRAINT.st, FUNCTIONAL_CONSTRAINT.mx],
	Reporting: [
		FUNCTIONAL_CONSTRAINT.st,
		FUNCTIONAL_CONSTRAINT.mx,
		FUNCTIONAL_CONSTRAINT.sp,
		FUNCTIONAL_CONSTRAINT.sv,
		FUNCTIONAL_CONSTRAINT.cf,
		FUNCTIONAL_CONSTRAINT.dc,
		FUNCTIONAL_CONSTRAINT.sg,
		FUNCTIONAL_CONSTRAINT.se,
		FUNCTIONAL_CONSTRAINT.sr,
		FUNCTIONAL_CONSTRAINT.or,
		FUNCTIONAL_CONSTRAINT.bl,
		FUNCTIONAL_CONSTRAINT.ex,
	],
	Internal: [
		FUNCTIONAL_CONSTRAINT.st,
		FUNCTIONAL_CONSTRAINT.mx,
		FUNCTIONAL_CONSTRAINT.sp,
		FUNCTIONAL_CONSTRAINT.sv,
		FUNCTIONAL_CONSTRAINT.cf,
		FUNCTIONAL_CONSTRAINT.dc,
		FUNCTIONAL_CONSTRAINT.sg,
		FUNCTIONAL_CONSTRAINT.se,
		FUNCTIONAL_CONSTRAINT.sr,
		FUNCTIONAL_CONSTRAINT.or,
		FUNCTIONAL_CONSTRAINT.bl,
		FUNCTIONAL_CONSTRAINT.ex,
	],
	Wired: [
		FUNCTIONAL_CONSTRAINT.st,
		FUNCTIONAL_CONSTRAINT.mx,
		FUNCTIONAL_CONSTRAINT.sp,
		FUNCTIONAL_CONSTRAINT.sv,
		FUNCTIONAL_CONSTRAINT.cf,
		FUNCTIONAL_CONSTRAINT.dc,
		FUNCTIONAL_CONSTRAINT.sg,
		FUNCTIONAL_CONSTRAINT.se,
		FUNCTIONAL_CONSTRAINT.sr,
		FUNCTIONAL_CONSTRAINT.or,
		FUNCTIONAL_CONSTRAINT.bl,
		FUNCTIONAL_CONSTRAINT.ex,
	],
	Poll: [
		FUNCTIONAL_CONSTRAINT.st,
		FUNCTIONAL_CONSTRAINT.mx,
		FUNCTIONAL_CONSTRAINT.sp,
		FUNCTIONAL_CONSTRAINT.sv,
		FUNCTIONAL_CONSTRAINT.cf,
		FUNCTIONAL_CONSTRAINT.dc,
		FUNCTIONAL_CONSTRAINT.sg,
		FUNCTIONAL_CONSTRAINT.se,
		FUNCTIONAL_CONSTRAINT.sr,
		FUNCTIONAL_CONSTRAINT.or,
		FUNCTIONAL_CONSTRAINT.bl,
		FUNCTIONAL_CONSTRAINT.ex,
	],
}
```

6. Create a dropdown to select an unresolved connection (= receiver LNode has a SourceRef child with an empty or no `source`) or create one

7. Upsert the SourceRef element in the database
