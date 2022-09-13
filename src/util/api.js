export const AUTH_TOKEN = 'auth.token'; // 访问令牌名称
export const DEFAULT_OPEN_KEY = 'default.open'; // 默认打开的菜单
export const DEFAULT_SELECT_KEY = "default.select"; // 默认选中的菜单
export const TOKEN_HEAD_NAME = 'Authorization'; // 令牌请求头名称


export let authToken = '/auth/user/login'; // 登入接口
export let authUserLogout = '/auth/user/logout'; // 注销登入
export let authUserRefreshLogin = '/auth/user/refresh/login'; // 注销登入
export let authInfo = '/auth/user/info'; // 获取用户信息
export let authConst = '/auth/const/all' // 获取系统常量


/**
 * 功能管理模块
 *
 * @type {string}
 */
export let userFuncUpdate = '/auth/func/update'; // 功能更新
export let userFuncSelect = '/auth/func/select'; // 功能获取
export let userFuncDelete = '/auth/func/delete'; // 功能删除
export let userFuncDeleteUserBind = '/auth/func/delete/user/bind'; // 用户解绑
export let userFuncDeleteResourceBind = '/auth/func/delete/resc/bind'; // 资源解绑
export let userFuncSave = '/auth/func/save'; // 功能保存
export let userFuncPage = '/auth/func/page'; // 功能列表
export let userFuncListTree = '/auth/func/list/tree'; // 功能树获取


/**
 * 角色管理模块
 *
 * @type {string}
 */
export let userRoleDelete = "/auth/role/delete"; // 角色删除
export let userRoleUpdateUser = '/auth/role/user/update'; // 角色分配用户
export let userRoleUpdateUserInit = '/auth/role/user/update/init'; // 角色分配用户初始化
export let userRoleUpdate = '/auth/role/update'; // 角色更新
export let userRoleSelect = '/auth/role/select'; // 获取角色
export let userRolePage = '/auth/role/page'; // 用户角色列表
export let userRoleSave = '/auth/role/save'; // 保存用户角色
export let userRoleAuthInit = '/auth/role/func/update/init'; // 角色分配功能初始化
export let roleFuncUpdate = '/auth/role/func/update'; // 角色分配功能
export let userRoleAuthFuncCheck = '/auth/role/func/update/check'; // 角色分配校验


/**
 * 资源管理模块
 * @type {string}
 */
export let userRescSearch = '/auth/resc/search'; // 资源搜索
export let userRescDelete = "/auth/resc/delete"; // 资源删除
export let userRescUpdate = '/auth/resc/update'; // 资源更新
export let userRescSelect = '/auth/resc/select'; // 获取资源
export let userRescPage = '/auth/resc/page'; // 资源列表
export let userRescSave = '/auth/resc/save'; // 保存资源


/**
 * 用户管理模块
 *
 * @type {string}
 */
export let authUserSelect = '/auth/user/select'; // 用户获取
export let authUserUpdate = '/auth/user/update'; // 用户更新
export let authUserPage = '/auth/user/page'; // 用户列表
export let authUserRoleUpdateInit = '/auth/user/role/update/init'; // 用户分配角色初始化
export let authUserRoleUpdate ='/auth/user/role/update'; // 用户分配角色
export let authUserSave = '/auth/user/save'; // 用户保存
export let authUserUpdatePwd = '/auth/user/update/password'; // 修改密码
export let authDeptList = '/auth/dept/list'; // 部门列表
export let authUserDelete = '/auth/user/delete'; // 删除用户
export let authUserEnable = '/auth/user/update/enable'; //启用用户
export let authUserRoleNames = '/auth/user/select/role/names'; // 查询用户角色
export let authUserDisable = '/auth/user/update/disable'; // 用户禁用


export default {};