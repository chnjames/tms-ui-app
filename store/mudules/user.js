import {getUserProfile, getUserList} from '@/api/user'
import {getProjectSimpleList} from '@/api/project'
import {getAllMaterial} from '@/api/warehouse'
import {smsLogin, weixinMiniAppLogin, logout, authLogin, refreshToken, getTenantCode} from '@/api/auth'

const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'
const TenantIdKey = 'TENANT_ID'
const UserListKey = 'USER_LIST'
const ProjectListKey = 'PROJECT_LIST'
const MaterialListKey = 'MATERIAL_LIST'
const UserInfoKey = 'USER_INFO'

const user = {
  state: {
    accessToken: uni.getStorageSync(AccessTokenKey), // 访问令牌
    refreshToken: uni.getStorageSync(RefreshTokenKey), // 刷新令牌
    tenantId: uni.getStorageSync(TenantIdKey), // 租户编号
    userList: uni.getStorageSync(UserListKey), // 用户列表
    projectList: uni.getStorageSync(ProjectListKey), // 项目列表
    materialList: uni.getStorageSync(MaterialListKey), // 物料列表
    userInfo: uni.getStorageSync(UserInfoKey) // 用户信息
  },
  mutations: {
    // 更新 state 的通用方法
    SET_STATE_ATTR(state, param) {
      if (param instanceof Array) {
        for (let item of param) {
          state[item.key] = item.val
        }
      } else {
        state[param.key] = param.val
      }
    },
    // 更新租户编号
    SET_TENANT_ID(state, data) {
      state.tenantId = data
      uni.setStorageSync(TenantIdKey, data)
    },
    // 更新用户列表
    SET_USER_LIST(state, data) {
      state.userList = data
      uni.setStorageSync(UserListKey, data)
    },
    // 更新项目列表
    SET_PROJECT_LIST(state, data) {
      state.projectList = data
      uni.setStorageSync(ProjectListKey, data)
    },
    // 更新物料列表
    SET_MATERIAL_LIST(state, data) {
      state.materialList = data
      uni.setStorageSync(MaterialListKey, data)
    },
    // 更新令牌
    SET_TOKEN(state, data) {
      // 设置令牌
      const {accessToken, refreshToken} = data
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      uni.setStorageSync(AccessTokenKey, accessToken)
      uni.setStorageSync(RefreshTokenKey, refreshToken)

      // 加载用户信息
      // this.dispatch('ObtainUserInfo')
    },
    // 更新用户信息
    SET_USER_INFO(state, data) {
      state.userInfo = data
      uni.setStorageSync(UserInfoKey, data)
    },
    // 清空令牌 和 用户信息
    CLEAR_LOGIN_INFO(state) {
      uni.removeStorageSync(AccessTokenKey)
      uni.removeStorageSync(RefreshTokenKey)
      uni.removeStorageSync(TenantIdKey)
      uni.removeStorageSync(UserListKey)
      uni.removeStorageSync(UserInfoKey)
      uni.removeStorageSync(ProjectListKey)
      uni.removeStorageSync(MaterialListKey)
      state.accessToken = ''
      state.refreshToken = ''
      state.tenantId = ''
      state.userList = []
      state.projectList = []
      state.materialList = []
      state.userInfo = {}
    }
  },
  actions: {
    //账号登录
    Login({state, commit}, {type, data}) {
      if (type === 0) {
        return authLogin(data)
          .then(res => {
            commit('SET_TOKEN', res.data)
            return Promise.resolve(res)
          })
          .then(() => {
            return this.dispatch('ObtainUserInfo')
          })
          .then(() => {
            return this.dispatch('GetUserList')
          })
          .then(() => {
            return this.dispatch('GetProjectList')
          })
          .then(() => {
            return this.dispatch('GetMaterialList')
          })
          .catch(err => {
            return Promise.reject(err)
          })
      } else if (type === 1) {
        return smsLogin(data)
          .then(res => {
            commit('SET_TOKEN', res.data)
            return Promise.resolve(res)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      } else {
        return weixinMiniAppLogin(data)
          .then(res => {
            commit('SET_TOKEN', res.data)
            return Promise.resolve(res)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }
    },
    // 退出登录
    Logout({state, commit}) {
      return logout()
        .then(res => {
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
        .finally(() => {
          commit('CLEAR_LOGIN_INFO')
        })
    },
    // 获得用户基本信息
    ObtainUserInfo({state, commit}) {
      return getUserProfile().then(res => {
        commit('SET_USER_INFO', res.data)
        return Promise.resolve(res)
      }).catch(err => {
        return Promise.reject(err)
      })
    },
    // 刷新令牌
    RefreshToken({state, commit}) {
      return refreshToken({refreshToken: state.refreshToken})
        .then(res => {
          commit('SET_TOKEN', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 更新租户编号
    ObtainTenantId({state, commit}, data) {
      return getTenantCode(data)
        .then(res => {
          commit('SET_TENANT_ID', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 获取用户列表
    GetUserList({state, commit}, data) {
      return getUserList(data)
        .then(res => {
          commit('SET_USER_LIST', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 获取项目列表
    GetProjectList({state, commit}, data) {
      return getProjectSimpleList(data)
        .then(res => {
          commit('SET_PROJECT_LIST', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    },
    // 获取物料列表
    GetMaterialList({state, commit}, data) {
      return getAllMaterial(data)
        .then(res => {
          commit('SET_MATERIAL_LIST', res.data)
          return Promise.resolve(res)
        })
        .catch(err => {
          return Promise.reject(err)
        })
    }
  }
}
export default user
