# Git {ignore}

版本控制系统(version control system)VCS,是一种记录一个或若干文件内容变化，以便将来查阅特定版本修订情况的系统。
[toc]

## 版本控制系统演进

本地版本控制系统
集中化的版本控制系统
分布式版本控制系统

## 日常工作流

## git 指令

```shell
    git config   //进行配置

    ssh-keygen -t rsa  //生成密钥

    git config --global user.email xxx.@email.com //设置全局个人邮箱号

    git config --global user.name  xxx  //设置全局个人用户名

    git clone <repository> //克隆远程仓库

    git add <file | .> //将文件添加到缓存区

    git commit -m <msg>  //将缓存区文件提交成一个版本

    git status 查看当前文件的状态

    git checkout -- <file>  //撤销工作区修改

    git reset HEAD <file>  //将文件从缓存区移出，暂存区文件撤销（不覆盖工作区）

    git log  //查看提交日志

    git reflog  //查看历史操作记录

    git reset --hard [HEAD~<n>|<ID>] //版本回退n个版本||跳转到版本号为ID的版本
        指令：   | 作用范围
        --hard  | 回退全部包括HEAD,index,working tree
        --mixed | 回退部分，包括HEAD,index
        --soft  | 只回退HEAD

    git rebase -i  HEAD~3 //多个版本进行合并,-i指以交互式界面进行操作,HEAD~3最近三次版本

    git push (-u) origin master //将文件推送到远程

    git diff  //比较工作区与暂存区
    git diff --cached  //比较暂存区与本地版本库中最近一次commit的内容
    git diff HEAD  //比较工作区与本地版本库中最近一次commit的内容
    git diff <commit ID> <commit ID> //比较两个commit之间的差异

    git branch  //查看分支
    git branch <name> //创建分支
    git checkout <name>  //切换分支
    git checkout -b <name> //创建并切换分支
    git branch -d <name>  //删除本地分支
    git push -d <origin> <branch> //删除远程分支

    git merge <branch>  //分支合并

    git pull origin master  //将文件从远程拉取下来
```

## 本地操作

<img src='https://g.gravizo.com/svg?
  digraph G {
    aize ="10,10";
    WorkingDirectory工作目录[shape=box];
    StageingArea暂存区[shape=box];
     RepositoryGit仓库[shape=box];
    WorkingDirectory工作目录 ->{untracked,modified}[style=dotted];
    StageingArea暂存区->staged[style=dotted];
    RepositoryGit仓库->committed[style=dotted];
    untracked -> staged [weight=8,label="add files"];
    modified -> staged[label="stage files"];
    staged -> committed [label="commit"];
    modified -> committed[label="edit files"];
  }
'>
