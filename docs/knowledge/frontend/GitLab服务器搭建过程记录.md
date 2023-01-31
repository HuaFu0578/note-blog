# <center>GitLab服务器搭建</center>

## 1. 打开HTTP和SSH访问

### 1.1 安装

```shell
sudo yum install -y curl policycoreutils-python openssh-server
```

### 1.2 开启SSH

```shell
sudo systemctl enable sshd
sudo systemctl start sshd
```

### 1.3 开启HTTP

```shell
sudo firewall-cmd --permanent --add-service=http
sudo systemctl reload firewalld

systemctl start firewalld //如果防火墙未打开，则运行打开
```

## 2. 安装GitLab

### 2.1 添加GitLab库

```shell
curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
```

### 2.2 安装GitLab

```shell
sudo yum install -y gitlab-ee
```

### 2.3 修改配置

```shell
vim /etc/gitlab/gitlab.rb

gitlab-ctl reconfigure
gitlab-ctl restart

```

## 3. 安装postfix发送邮件

```shell
sudo yum install postfix

sudo systemctl enable postfix //将postfix服务设置成开机启动

sudo systemctl start postfix //启动postfix
```
