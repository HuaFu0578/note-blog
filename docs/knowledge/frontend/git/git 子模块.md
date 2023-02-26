# git 子模块

[Git submodule](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

## 1. 添加子模块

```shell
#!/bin/bash

$ git submodule add https://github.com/chaconinc/DbConnector
```

## 2. 克隆含有子模块的项目

```shell
#!/bin/bash

$ git clone --recurse-submodules https://github.com/chaconinc/MainProject # 直接递归克隆子模块数据

$ git submodule init # 初始化子模块

$ git submodule update # 拉取子模块数据

$ git submodule update --init # 将 git submodule init 和 git submodule update 合并成一步

$ git submodule update --init --recursive # 初始化、抓取并检出任何嵌套的子模块

$ git submodule update --remote DbConnector # git会进入子模块然后抓取并更新

$ git config -f .gitmodules submodule.DbConnector.branch stable # 设置子模块跟踪分支

```

### 2.1 在包含子模块的项目上工作

```shell
#!/bin/bash

$ git pull --recurse-submodules # 拉取包括子模块数据

$ git submodule update --remote --rebase # 更新拉取子模块数据和本地合并

$ git push --recurse-submodules=check # 推送前检查子模块是否推送

$ git push --recurse-submodules=on-demand # 推送前自动尝试推送子模块

```

## 3. 子模块的删除

删除子模块
有时子模块的项目维护地址发生了变化，或者需要替换子模块，就需要删除原有的子模块。

删除子模块较复杂，步骤如下：

`rm -rf`子模块目录 删除子模块目录及源码
`vi .gitmodules` 删除项目目录下`.gitmodules`文件中子模块相关条目
`vi .git/config` 删除配置项中子模块相关条目
`rm .git/module/*` 删除模块下的子模块目录，每个子模块对应一个目录，注意只删除对应的子模块目录即可

执行完成后，再执行添加子模块命令即可，如果仍然报错，执行如下：

`git rm --cached 子模块名称`

完成删除后，提交到仓库即可。

## 4. 子模块技巧

```shell
#!/bin/dash
$ git submodule foreach 'git stash' # foreach 批量操作子模块

```

在为父级项目拉取更新时，还会出现一种特殊的情况：在你拉取的提交中， 可能 .gitmodules 文件中记录的子模块的 URL 发生了改变。 比如，若子模块项目改变了它的托管平台，就会发生这种情况。 此时，若父级项目引用的子模块提交不在仓库中本地配置的子模块远端上，那么执行`git pull --recurse-submodules`或`git submodule update`就会失败。 为了补救，需要借助`git submodule sync`命令：

```shell
#!/bin/bash

# 将新的 URL 复制到本地配置中
$ git submodule sync --recursive
# 从新 URL 更新子模块
$ git submodule update --init --recursive
```

## `.gitmodules`文件

该配置文件保存了项目 URL 与已经拉取的本地目录之间的映射

:::tip
 由于 .gitmodules 文件中的 URL 是人们首先尝试克隆/拉取的地方，因此请尽可能确保你使用的 URL 大家都能访问。 例如，若你要使用的推送 URL 与他人的拉取 URL 不同，那么请使用他人能访问到的 URL。 你也可以根据自己的需要，通过在本地执行 git config submodule.DbConnector.url <私有URL> 来覆盖这个选项的值。 如果可行的话，一个相对路径会很有帮助。
:::
