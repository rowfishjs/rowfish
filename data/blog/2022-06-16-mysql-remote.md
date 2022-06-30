---

slug: mysql-remote-access

title: Mysql远程连接

authors: pincman

tags: [mysql, mariadb,linux]

rf_summary: 有两台云服务器,一台性能和内存很好,另一台带宽够大,所以内存大的放数据库,带宽大的做web服务器,这需要配置一下Mysql的远程访问

---

# 配置mysql8远程访问

最近总是遇到生成服务器因内存不足挂掉的情况,找了一下原因是因为mariadb内存占用过多导致服务器内存不够,于是把数据库服务部署到开发机上，找了一下[mariadb](https://mariadb.com/kb/en/configuring-mariadb-for-remote-client-access/)官网的方法解决了。

登录mysql并更新表就你可以

```shell
mysql -u root -p 
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION;
flush privileges;
```