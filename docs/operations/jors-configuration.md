# Job Output (JORS) Configuration

The SQL Server configuration parameter 'max text repl size' limits the maximum size of the job output response SMA Technologies can accept and store in the SQL database. Execute the following SQL command to increase the number of characters that can be stored. The default is 65536. If it is still too small, increase it again.

:::tip Example

sp_configure 'max text repl size','600000' RECONFIGURE

:::

The maximum value for this configuration parameter is 2147483647.

Versions of OpCon before 4.0 contain a bug that does not allow users to view all their job output from Symitar jobs. Most jobs will be able to have their output viewed without problem. Some jobs like GOODNIGHT will probably exceed the maximum viewable limit. To get around this problem, create a shell script:

```
cat "/ops/bin/RSJ 0 GOODNIGHT|tee /tmp/GOODNIGHT.OUT" >/tmp/GOODNIGHT.KSH chmod ugo+x /tmp/GOODNIGHT.KSH
```

In the start image line in OpCon: ```/bin/ksh /tmp/GOODNIGHT.KSH```


When the job runs, the output will be copied to ```/tmp/GOODNIGHT.OUT``` and ```STDOUT```. Users can then use a text editor (i.e., vi) to view the output.
