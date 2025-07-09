<SCL>
<!-- This file picture an Application after FSD imports -->

	<!-- name="TEMPLATE" structure = scoped -->
  <Substation name="TEMPLATE">
		<!-- START GLOBAL FSD IMPORT - SEE 01-2 -->
		<Private type="eIEC61850-6-100">
      <eIEC61850-6-100:FunctionCategory name="dummyScopedFunctionCategory">
				<!-- functionUuid has been updated to reflect the new one affected because of the import -->
        <eIEC61850-6-100:FunctionCatRef functionUuid="101112" />
      </eIEC61850-6-100:FunctionCategory>
    </Private>
		<!-- END GLOBAL FSD IMPORT -->

    <VoltageLevel name="TEMPLATE">
      <Bay name="TEMPLATE">

        <!-- NOT EDITION READY = NAMESPACE + PRIVATE CONTAINER REQUIRED -->
        <Private type="eIEC61850-6-100">
					<!-- START CREATION - AllocationRole -->
					<!-- Lives at the same level of the application -->
					<!-- kind of tags defining function groups -->
					<!-- Elia modelling guidelines provides a finished list of allocation Roles -->
					<!-- the name of the AllocationRole defines what kind it is -->
					<eIEC61850-6-100:AllocationRole name="dummyAllocationRole">
						<!-- choice is given to use path OR / AND the Uuid -->
            <eIEC61850-6-100:FunctionRef function="TEMPLATE/TEMPLATE/TEMPLATE/dummyScopedFunction" functionUuid=""/>
						<eIEC61850-6-100:FunctionRef function="TEMPLATE/TEMPLATE/TEMPLATE/dummyGlobalFunction" functionUuid=""/>
          </eIEC61850-6-100:AllocationRole>
					<!-- END CREATION - AllocationRole -->

					<eIEC61850-6-100:Application name="dummyApplication">
					<!-- START CREATION - FunctionRole - based on imported Functions -->
					<!-- These have to be created automagically when using the UI to create the data flow between Function's LNodes -->
						<!-- FunctionRole is kind of a categorization in the context of the application - can contain multiple functions -->
						<eIEC61850-6-100:FunctionRole name="dummyScopedFunction.Role">
							<!-- FunctionRoleContent multiple possible - scoped to a bay -->
							<eIEC61850-6-100:FunctionRoleContent roleInst="1">
								<!-- FunctionRef multiple possible -->
								<eIEC61850-6-100:FunctionRef function="TEMPLATE/TEMPLATE/TEMPLATE/dummyScopedFunction"/>
								<eIEC61850-6-100:FunctionRef function="TEMPLATE/TEMPLATE/TEMPLATE/dummyGlobalFunction">
									<eIEC61850-6-100:SignalRole name="dummySignalRole">
										<!-- User decides how many Elements he adds here between those : -->
										<!-- LNodeInputRef a reference to a source ref = input of LNode (child of LNode Element) -->
										<!-- LNodeInputRef = Definition of the data flow between to LNodes - for example a measure value exchange -->
										<eIEC61850-6-100:LNodeInputRef sourceRefUuid=""><eIEC61850-6-100:LNodeInputRef>

										<!-- LNodeOutputRef a reference to a control ref = output of LNode (child of LNode Element)  -->
										<!-- LNodeInputRef = Definition of the data flow between to LNodes - controlling part -->
										<eIEC61850-6-100:LNodeOutputRef controlRefUuid=""></eIEC61850-6-100:LNodeOutputRef>

										<!-- LNodeDataRef a reference to a data object of LNode = DOS or DAS element (child of LNode Element) -->
										<eIEC61850-6-100:LNodeDataRef lnodeUuid="" doName="" daName=""></eIEC61850-6-100:LNodeDataRef>
									</eIEC61850-6-100:SignalRole>
								</eIEC61850-6-100:FunctionRef>
							</eIEC61850-6-100:FunctionRoleContent>
						</eIEC61850-6-100:FunctionRole>
						<eIEC61850-6-100:FunctionRole name="dummyGlobalFunction.Role">
							<eIEC61850-6-100:FunctionRoleContent roleInst="1">
								<eIEC61850-6-100:FunctionRef function="TEMPLATE/TEMPLATE/TEMPLATE/dummyGlobalFunction"/>
							</eIEC61850-6-100:FunctionRoleContent>
						</eIEC61850-6-100:FunctionRole>
					<!-- END CREATION - FunctionRole -->
					</eIEC61850-6-100:Application>
				</Private>
				

				<!-- We should be open for other guidelines -->
				<!-- Modelling guidelines coming from Elia -->
				<!-- Imported Function are becoming SubFonction of a created on the fly Function, named after the application - if not existing -->
				<!-- All function imported elements are being created as SubFunction of this element-->
				<Function name="dummyApplication">
					<!-- START - SEE 01.1 -->
					<Private type="eIEC61850-6-100">
						<eIEC61850-6-100:BehaviorDescription fileReference="path_to_file" format="check_the_defined_list_in_the_namespace" isSimulation="false" isSpecification="false" name="dummy_BehD">
							<eIEC61850-6-100:InputVar varName="" inputName="" inputUuid="" dataName="" />
							<eIEC61850-6-100:OutputVar varName="" outputName="" outputUuid="" dataName="" />
						</eIEC61850-6-100:BehaviorDescription>
					</Private>
					<!-- END - SEE 01.1 -->

					<!-- START GLOBAL FSD IMPORT - SEE 01-2 -->
					<SubFunction name="dummyGlobalFunction" uuid="101112" templateUuid="456">
						<!-- START CREATION - FunctionSclRef -->
						<Private type="eIEC61850-6-100">
							<eIEC61850-6-100:FunctionSclRef>
								<!-- version / revision and fileUuid are coming from the Header Element -->
								<eIEC61850-6-100:FunctionSclRefElement fileType="fsd" fileName="01-2.function-global-creation" version="" revision="" fileUuid=""/>
							</eIEC61850-6-100:FunctionSclRef>
						</Private>
						<!-- END CREATION - FunctionSclRef -->
						<LNode type="dummyLNodeType">
							<Private type="eIEC61850-6-100">
							<eIEC61850-6-100:LNodeSpecNaming sIedName="None" sLdInst="dummyGlobalFunction" sLnInst="" sPrefix="" sLnClass=""/>
							</Private>
						</LNode>
					</SubFunction>
					<!-- END GLOBAL FSD IMPORT -->

					<!-- START SCOPED FSD IMPORT - SEE 01-3 -->
					<!-- same uuids rules applies here when switching from a Function to a subfunction -->
					<SubFunction name="dummyScopedFunction" uuid="789" templateUuid="123">
						<!-- START CREATION - FunctionSclRef -->
						<Private type="eIEC61850-6-100">
							<eIEC61850-6-100:FunctionSclRef>
								<!-- version / revision and fileUuid are coming from the Header Element -->
								<eIEC61850-6-100:FunctionSclRefElement fileType="fsd" fileName="01-3.function-scoped-creation" version="" revision="" fileUuid=""/>
							</eIEC61850-6-100:FunctionSclRef>
						</Private>
						<!-- END CREATION - FunctionSclRef -->

						<LNode type="dummyLNodeType">
							<Private type="eIEC61850-6-100">
								<!-- Input of the function block -->
								<!-- START CREATION - LNodeInputs -->
								<eIEC61850-6-100:LNodeInputs>
									<!-- See the dedicated 90-30 chapter -->
									<!-- Multiple SourceRefs -->
									<!-- unique id defined pdA + input + inputInst attributes when no Uuid -->
									
									<!-- created at this stage ASD : the -->
									<!-- once sourceRef is implemented in the real device then the extRef, address are fulfilled - coming from the ICDs files -->
									<!-- the external tool creating the ICDs:
									 * creating the ExtRefs inside the IEDs
									 * mapping SourceRefs with ExtRefs
									-->
									<!-- service attribute is implemented Goose / SampleValue / etc -->
									<!-- receiver side => SourceRef = specification / ExtRef = implementation -->
									<!-- both are in the same device only when the service is internal -->
									<!-- represents a data flow between two lNodes SourceRef on one side and a DA/DO on the other side (nested in the LNode or coming from the DataTypeTemplates > LNodeTypes) -->
									<!-- Points to a DA (= specific for Goose or SampleValue services) or a DO (= specific for reporting services) -->
									<!-- resourceName is only used when no Uuids are used, otherwise resourceUuid is used -->
									<!-- extRefAddr is only used when no Uuids are used, otherwise extRefUuid is used -->
									<!-- resource refers to processResource element which is coming from the first available element at top level - Function / Bay / etc -->
									<!-- resourceName is a string represented by the path of the element like TEMPLATE/TEMPLATE/TEMPLATE/dummyApplication/resourceName in case of an element in this Function -->
									
									<!-- the choice is given :-->
									<!-- using sourceDoName="" sourceDaName="" sourceLNodeUuid="" = name or uuid from the DA or DO and LNode parent - sender -->
									<!-- AND / OR -->
									<!-- using source with the path string -->
									<eIEC61850-6-100:SourceRef uuid="" pDO="" pLN="" resourceName="" resourceUuid="" pDA="" input="" inputInst="" service="" source="" sourceDoName="" sourceDaName="" sourceLNodeUuid="" extRefAddr="" extRefUuid="" />
								</eIEC61850-6-100:LNodeInputs>
								<!-- END CREATION - LNodeInputs -->
								<!-- START CREATION - LNodeOutputs -->
								<eIEC61850-6-100:LNodeOutputs>
									<!-- See the dedicated 90-30 chapter -->
									<!-- Multiple ControlRefs -->
									<!-- specified when the LNode is controlling the DO from another LNode -->
									<!-- example ControlRef from a HMI pointing to a DO contained in a LNode (in a Function)-->
									<!-- See SourceRef - same use of processResource -->
									<!-- resourceName is only used when no Uuids are used, otherwise resourceUuid is used -->
									<!-- extCtrlAddr is only used when no Uuids are used, otherwise extCtrlUuid is used -->

									<!-- the choice is given :-->
									<!-- using controlledDoName="" controlledLNodeUuid="" = name or uuid from the DO and LNode parent -->
									<!-- AND / OR -->
									<!-- using controlled with the path string -->
									<eIEC61850-6-100:ControlRef uuid="" pDo="" pLN="" resourceName="" resourceUuid="" output="" outputInst="" controlled="" controlledDoName="" controlledLNodeUuid="" extCtrlAddr="" extCtrlUuid="" />
								</eIEC61850-6-100:LNodeOutputs>
								<!-- END CREATION - LNodeOutputs -->

								<!-- START CREATION - DOS -->
								<!-- ~like the DAI and DOI section from the IED - 'instantiation' of the DataTypeTemplate Section -->
								<!-- the user will add information here like a value or a description or to specify data flow that need to be fulfilled when combining multiple application with each other -->
								<!-- This structure can vary -->
								<eIEC61850-6-100:DOS>
									<!-- ELIA Modelling guidelines : predefined list of ids -->
									<!-- Labels are needed to document at the data level attribute level -->
									<eIEC61850-6-100:Labels>
										<eIEC61850-6-100:Label id="" lang="">text</eIEC61850-6-100:Label>
									</eIEC61850-6-100:Labels>

									<eIEC61850-6-100:SDS>

										<eIEC61850-6-100:Labels>
											<eIEC61850-6-100:Label id="" lang="">text</eIEC61850-6-100:Label>
										</eIEC61850-6-100:Labels>

										<eIEC61850-6-100:DAS desc="" name="">
											<eIEC61850-6-100:Labels>
												<eIEC61850-6-100:Label id="" lang="">text</eIEC61850-6-100:Label>
											</eIEC61850-6-100:Labels>
											<eIEC61850-6-100:Val>text</eIEC61850-6-100:Val>
										</eIEC61850-6-100:DAS>

										<eIEC61850-6-100:SDS>
											<eIEC61850-6-100:Labels>
												<eIEC61850-6-100:Label id="" lang="">text</eIEC61850-6-100:Label>
											</eIEC61850-6-100:Labels>
										</eIEC61850-6-100:SDS>

									</eIEC61850-6-100:SDS>
								</eIEC61850-6-100:DOS>
								<!-- END CREATION - DOS -->
							</Private>
						</LNode>
					</SubFunction>
					<!-- END SCOPED FSD IMPORT -->
				</Function>
				
				<!-- START SCOPED FSD IMPORT - SEE 01-3 -->
				<Private type="eIEC61850-6-100">
          <eIEC61850-6-100:FunctionCategory name="dummyScopedFunctionCategory">
            <!-- functionUuid has been updated to reflect the new one affected because of the import -->
						<eIEC61850-6-100:FunctionCatRef functionUuid="789">
          </eIEC61850-6-100:FunctionCategory>
        </Private>
				<!-- END SCOPED FSD IMPORT -->

      </Bay>
    </VoltageLevel>
  </Substation>

	<!-- START FSD IMPORTS - Merged DataTypeTemplates -->
	<DataTypeTemplates>
		<LNodeType name="dummyLNodeType"/>
	</DataTypeTemplates>
	<!-- END FSD IMPORTS -->

</SCL>