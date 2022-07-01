---

slug: mysql8-change-password

title: mysql8更改密码注意事项

authors: pincman

tags: [mysql, msyql8,linux]

rf_summary: mysql8因为密码机制的改变,所以密码强度需要更改后才能使用简单密码

---

安装后
```ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';```

如果报错，那是因为你在安装的时候设置了密码复杂度，清除设置就可以
```
set global validate_password.policy=0;
set global validate_password.length=4;
```
然后退出后再执行
```
mysql_secure_installation
```
再执行上面的`ALTER`命令就可以了