<SCL>
<!-- This file picture an Application creation -->
<!-- APPLICATIONS ARE DEFINED IN THE 7-6 REPORT -->
<!-- Only ONE Application Element is allowed per ASD -->

<!-- The user decide on which level the Application Element is created -->
<!-- The user decide on which level the Function Element is created -->
<!-- The Function wrapper Element SHOULD be at the SAME level or BELOW the Application Element -->
<!-- The Application Element SHOULD always at the higher level -->
<!-- In this example both the Application and Function Elements are on the same Bay level-->

<!-- name="TEMPLATE" structure = scoped -->
  <Substation name="TEMPLATE">
    <VoltageLevel name="TEMPLATE">
      <Bay name="TEMPLATE">
      
        <!-- NOT EDITION READY = NAMESPACE + PRIVATE CONTAINER REQUIRED -->
        <Private type="eIEC61850-6-100">
					<eIEC61850-6-100:Application name="dummyApplication">
					</eIEC61850-6-100:Application>
				</Private>

        <Function name="dummyApplication">
          <!-- START CREATION - BehaviorDescription -->
					<Private type="eIEC61850-6-100">
            <!-- if linked to a subfunction, then the BehaviorDescription should be created on the level of the subfunction Element -->
						<eIEC61850-6-100:BehaviorDescription fileReference="path_to_file" format="check_the_defined_list_in_the_namespace" isSimulation="false" isSpecification="false" name="dummy_BehD">
							<!-- These elements connects what's inside the BehDesc file with the SSD file -->
							<!-- varName is in the BehDesc file -->
							<!-- then two choices on the SSD file side: -->
							<!-- input = SourceRef Element -->
							<!-- inputName = path ref AND / OR using the uuid with inputUuid -->
							<!-- OR -->
							<!-- using the dataName to link a DO or a DA = path ref -->
							<eIEC61850-6-100:InputVar varName="" inputName="" inputUuid="" dataName="" />
							<!-- Same as Input Var - except -->
							<!-- output = ControlRef Element -->
							<!-- outputName = path ref AND / OR using the uuid with outputUuid -->
							<eIEC61850-6-100:OutputVar varName="" outputName="" outputUuid="" dataName="" />
						</eIEC61850-6-100:BehaviorDescription>
					</Private>
          <!-- END CREATION - BehaviorDescription -->
        </Function>
      </Bay>
    </VoltageLevel>
  </Substation>

</SCL>