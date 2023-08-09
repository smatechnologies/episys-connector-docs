---
sidebar_label: 'Release notes'
---

# Episys Agent release notes

## Version 22.00.0100

2021 December

:white_check_mark: **CONNUTIL-538**: Added additional debugging into LookForReportSequenceInReports.

## Version 22.00.0000

2021 December

:white_check_mark: **CONNUTIL-538**: Fixed an issue where utilities returned a 'SYM is in an unknown state' error message by updating PATH and ENV variables. Added ability for RSJ, SAJ, and utilities to add environment variables at runtime.

## Version 21.00.0000

2021 March

:white_check_mark: **CONNUTIL-489**: Fixed an issue where LookForBatchOutputSequence would fail if the Episys job was run with the ExecuteAsRoot utility.

## Version 18.00.0000

2018 April

:eight_spoked_asterisk: Added a java application (SMASFTPClient) that satisfies the need for SFTP support.


:eight_spoked_asterisk: Created optical_transfer_sftp. This proved not to be viable as it cannot leverage sftp like optical_transfer leverages ftp. An additional module (ssh_askpass) has to be installed to handle the password requirement. Since Symitar reformats the drive when an OS upgrade is performed, the new module would be lost.
