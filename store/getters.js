const getters = {
  accessToken: state => state.user.accessToken,
  refreshToken: state => state.user.refreshToken,
  tenantId: state => state.user.tenantId,
  userList: state => state.user.userList,
  userInfo: state => state.user.userInfo,
  hasLogin: state => !!state.user.accessToken
}
export default getters
