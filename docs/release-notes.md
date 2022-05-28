---
sidebar_label: 'Release notes'
---

# Episys Agent release notes

## Version 21.00.0000

2021 March

:white_check_mark: **CONNUTIL-489**: Fixed an issue where LookForBatchOutputSequence would fail if the Episys job was run with the ExecuteAsRoot utility.

## Version 18.00.0000

2018 April

:eight_spoked_asterisk: Added a java application (SMASFTPClient) that satisfies the need for SFTP support.


:eight_spoked_asterisk: Created optical_transfer_sftp. This proved not to be viable as it cannot leverage sftp like optical_transfer leverages ftp. An additional module (ssh_askpass) has to be installed to handle the password requirement. Since Symitar reformats the drive when an OS upgrade is performed, the new module would be lost.
