// Note
Dataflow with sender / receiver -> LNode 1 send data to LNode 2 (ex : Protection function that send a trip to a circuit breaker)
-> Defined by a SourceRef created in the receiver

Dataflow with controller / controlled -> HMI (LNode IHMI) send opening order to Circuit Breaker Interface (=LNode CSWI )
-> Defined by ControlRef created in the controller

## GENERAL SCENARIO:

- Select a LNode (to become a Sender OR a Controller)
- Select a LNode (to become a Receiver OR a Controlled)
- Select the dataflow type :
  - Sender / Receiver = GOOSE / SMV / Reporting / Internal / Wired / Poll
  - Controller / Controlled

## SCENARIO 1 : Sender / Receiver

We select the DataObject and DataAttribute of the sender :
<LNode type="A"> , then go to DataTypeTemplate to search for <LNodeType id=A>, then look for its children <DO> and <DA>
Each <DO> and <DA> can have references into the DataTypeTemplates. We need to resolve it via the `type` attribute of the element like this :

<LNodeType id="A">
	<DO type="DoTypeA" name="nameOne"></DO>
</LNodeType>
[...]
<DOType id="DoTypeA">
	<DA bType="Struct" type="DaTypeA" name="nameTwo"></DA>
	<SDO />
</DOType>
<DAType id="DaTypeA">
 <BDA type="EnumA" name="nameThree"></BDA>
</DAType>

You continue until you reach a <DA>. If the <DA> `bType` attribute is of type `Struct` then you continue otherwise you stop there.

In the end we want to concatenate the name of this tree, starting from the <DA>
We then display it to the user like this `nameTwo.nameThree`

A <DO> can have multiple <DA> children, so we will display a list of the resolved concatenated names of all <DA> children

It can be that you encounter a `fc` attribute on a <DA>, you should then check the provided array from the standard to check if it is allowed.
If it true, the <DA> can be processed, otherwise it should be ignored.

See Functional constraints (fc) - 7-3 p. 131/132

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

for example user has selected the service GOOSE, we can process <DA id="authorized">

<LNodeType id="A">
	<DO type="DoTypeA" name="nameOne"></DO>
</LNodeType>
[...]
<DOType id="DoTypeA">
	<DA id="authorized" type="DaTypeA" name="nameTwo" fc="mx"></DA>
	<SDO />
</DOType>
<DAType id="DaTypeA">
 <BDA type="EnumA" name="nameThree"></BDA>
</DAType>

### Receiver Side :

It can be that there are unresolved connection (meaning a SourceRef with en empty source attribute (or not present))

If it's the case :
The user should be able to select one unresolved SourceRef or we create a new one
The unresolved can be selected only if the SourceRef conditions are met, ie : the service should correspond to the selected one and the attributes `pLN`, `pDO`and `pDA` correspond to the selected <LNode> `id`, <DO> `id` and <DA> `id`. It can be that these attributes or empty or not present (then can be considered like a any type)

The script can propose a match (update or create) but this should not be abstracted to the user.

If the user create a new SourceRef, it should define the attribute `input` and `inputInst`:

- select an existing `input` (listing all existing input on SourceRefs from the current receiver/LNode = scoped) & the script should automatically increment the `inputInst` += 1
- defines a new `input` name (defaults to selected <DO> `name`) & auto set to `inputInst` = 1

=> The <SourceRef> can be created

See path resolution in chapter 5.2 in the version 90-30 of the standard for the `source` attribute (p. 27)

```ts
const source = {{ Substation.name }}/{{ VoltageLevel.name }}/{{ Bay.name }}/{{ Function.name }}/{{ SubFunction.name /*and on ... if applicable*/}}/{{ `${LNode.prefix}${LNode.lnClass}${LNode.lnInst}` }}.{{ DO.name }}.{{ DA.name }}
// last two depends on nested part in the DataTypeTemplates

const service: GOOSE | SMV | Reporting | Internal | Wired = "GOOSE" // selected service at the beginning

const resourceName: path = '' //to an element ProcessResource
```

<SourceRef service="{{ service }}" input="" inputInst="" pLN="{{ LNode.lnClass }}" pDO="{{ DO.name }}" pDA="{{ DA.name }}" uuid="" source="{{ source }}" sourceLNodeUuid="{{ LNode.uuid }}" sourceDoName="{{ DO.name }}" sourceDaName="{{ DA.name }}" resourceName="{{ resourceName }}" resourceUuid="" />

//Note pDO="{{ DO.name }}" pDA="{{ DA.name }}" are the same than the source, because it can be that you disconnect it, but you keep it as reference to recreate a new connection with the correct LNode Source

// the ProcessResource element has an xPath (which express candidates that can be linked to it) and cardinalities

### SCENARIO 1.1 Service GOOSE :

### SCENARIO 1.3 Service REPORTING :

ELIA GUIDELINES: the LNODE receiver can only be of type `ITCI` OR `IHMI`

```

```
