---

slug: mysql-remote-access

title: Mysql远程连接

authors: pincman

tags: [mysql, mariadb,linux]

rf_summary: 有两台云服务器,一台性能和内存很好,另一台带宽够大,所以内存大的放数据库,带宽大的做web服务器,这需要配置一下Mysql的远程访问

---

# 配置mysql8远程访问

有两台云服务器,一台性能和内存很好,另一台带宽够大,所以内存大的放数据库,带宽大的做web服务器,这需要配置一下Mysql的远程访问

登录mysql并更新表就你可以

```shell
mysql -u root -p 
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION;
flush privileges;
```