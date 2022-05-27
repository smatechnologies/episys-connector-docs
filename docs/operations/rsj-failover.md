# FAILOVER/FAILOVERD

The Symitar FAILOVER system allows a user to swap a primary and secondary machine if the primary machine becomes unavailable for some reason. Symitar has four main FAILOVER configurations.

It is not required for RSJ or OpCon to have either the FAILOVER macro or FAILOVERD daemon running or configured. If it is desired to configure one or both of these items, it is imperative that the complete FAILOVER system be implemented as described in "Episys Failover System Implementation – A technical discussion for implementing the Episys Failover System for disaster preparedness 10Nov02". 

This document is available on the Symitar web site for customers. Contact Symitar for assistance in configuring your FAILOVER systems. Failure to fully configure the FAILOVER systems will cause RSJ not to run. 

An additional restriction is that both the primary and secondary systems have all of their RSJ licenses in a single file on both systems. Failure to ensure that both the primary and secondary servers have their licenses on both systems will cause RSJ not to run after the FAILOVER macro runs.

Additional consideration must be given to OpCon in the FAILOVER system. It is highly recommended that the Symitar server be brought down in OpCon before the FAILOVER macro is run. 

Additionally, at a minimum, all schedules for the Symitar machine should be placed on hold. This prevents OpCon from inadvertently running jobs on the wrong machine. 

It is the users' responsibility to make sure that OpCon does not run jobs on the wrong machine once the FAILOVER macro has been run. It is highly advisable to hold all schedules until it is determined exactly what needs to run or be re-run.
 
Users must also take into account what happens when a program or a sequence of programs are interrupted because of the FAILOVER macro. The worst case scenario is that OpCon has just sent a job or series of job to the primary machine and the FAILOVER macro is activated.

Users must also take into account what happens when a program or sequence of programs were not run on the secondary machine. Users may need to re-run multiple jobs and/or schedules.

It is SMA Technologies' recommendation that the FAILOVERD not be run, but rather be run manually since there is no notification facility to OpCon that the primary machine has been replaced with the secondary machine.