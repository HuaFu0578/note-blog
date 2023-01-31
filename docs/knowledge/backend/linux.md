# Linux基本操作

[toc]

```shell
sudo apt-get update  //更新软件包等
sudo ps -e |grep ssh   //查看ssh状态
sudo apt-get install openssh-server  //安装ssh服务
su root //切换到root用户
exit //返回普通用户
lsof -i //用以显示符合条件的进程情况，
        //lsof(list open files)是一个列出当前系统打开文件的工具。
        //以root用户来执行lsof -i命令
lsof -i:端口号  //用于查看某一端口的占用情况
netstat -tunlp  //用于显示tcp，udp的端口和进程等相关情况
netstat -tunlp|grep 端口号  //用于查看指定端口号的进程情况
```

## nodejs 安装

1. 刷新本地包索引

    `sudo apt update`

2. 从存储库中安装Node.js

    `sudo apt install nodejs`

3. 检查从存储库中安装的Node.js版本

    `nodejs -v`

4. 安装npm

    `sudo apt install npm`

    使用PPA安装

    要获得更新版本的Node.js，您可以添加由NodeSource维护的PPA（个人包归档）。 这将拥有比官方Ubuntu版本库更新的Node.js版本，并允许你在Node.js v6.x（支持到2019年4月），Node.js v8.x（当前版本LTS版本，支持到2019年12月）和Node.js v10.x（最新版本，支持到2021年4月）。

5. 安装curl

    `sudo apt install curl`

6. 切换到主目录

    `cd ~`

7. 使用curl为你的首选版本安装脚本，确保使用首选版本字符串，我用的是Node.js v10.x，如果你用的版本是Node.js v6.x，则将10.x替换为6.x， 如果你用的版本是Node.js v8.x，则将10.x替换为8.x。（下面命令中的斜体内容即10.x根据自己的首选版本进行修改）。

    `curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh`

8. 使用gedit查看脚本

    `gedit nodesource_setup.sh`

    查看完按Ctrl + Q快捷键回到当前目录

9. 在sudo下运行脚本

    `sudo bash nodesource_setup.sh`

10. 再次重新安装Node.js

    `sudo apt install nodejs`

11. 查看Node.js版本

    `nodejs -v`

    我的Node.js版本显示是 v10.8.0

12. 查看npm版本

    `npm -v`

    我的npm版本显示是 6.2.0

13. 为了使一些npm包能够工作（例如那些需要从源代码编译代码的包），你需要安装build-essential包：

    `sudo apt install build-essential`

## Centos 7 安装MySQL

一般在linux下安装mysql 的步骤如下:
安装前看是否安装过mysql，
`yum list installed mysql*`
如果有就用yum remove卸载mysql
查看yum库下是否有mysql-server
`yum list | grep mysql 或 yum -y list mysql*`
如果没有（一般在centos7下没有）
`wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
rpm -ivh mysql-community-release-el7-5.noarch.rpm`
然后安装mysql
`yum install mysql-server
yum install mysql-devel`
如果有mysql-server，则按下面步骤
安装mysql客户端：
`yum install mysql`
安装mysql 服务器端：
`yum install mysql-server`
`yum install mysql-devel`
然后在mysql配置文件/etc/my.cnf的[mysqld]中加入character-set-server=utf8
然后启动mysql服务
`service mysqld start`
登录mysql
`mysql -u root -p`
刚安装密码为空，直接按回车
切换到mysql数据库：`use mysql`;
然后修改密码`UPDATE user SET password=password("你的密码") WHERE user='root'`;
刷新权限
`FLUSH PRIVILEGES`;
之后采用`mysql -h 127.0.0.1 -u root -p` 登录然后输入密码
如果没有-h那么是无密码登录 登录的用户没有任何权限，当然能修改密码

`mysql>GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;`

[Centos7.4 修改MySQL5.7 root 密码](https://www.cnblogs.com/jekaysnow/p/8849533.html)

1.`vim /etc/my.cnf`
2.在[mysqld]中添加
`skip-grant-tables`
例如：
[mysqld]
>skip-grant-tables
>datadir=/var/lib/mysql
>socket=/var/lib/mysql/mysql.sock

3.重启mysql
`service mysql restart`
4.用户无密码登录
`mysql -uroot -p (直接点击回车，密码为空)`
5.选择数据库
`use mysql`;
6.修改root密码
`update mysql.user set authentication_string=password('新密码') where user='用户'`;
7.执行
 `flush privileges`;
8.退出 mysql
`quit`
9.编辑 /etc/my.cnf
删除 `skip-grant-tables`  保存退出
10.重启mysql
`service mysql restart`

## 其他Tips

Linux 下监听 < 1024 的端口要 root 权限。

## 问答

1. [linux如何查看端口被哪个进程占用?][端口占用]

***********************************
[端口占用]:https://jingyan.baidu.com/article/546ae1853947b71149f28cb7.html
