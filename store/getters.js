const getters = {
  accessToken: state => state.user.accessToken,
  refreshToken: state => state.user.refreshToken,
  tenantId: state => state.user.tenantId,
  userList: state => state.user.userList,
  projectList: state => state.user.projectList,
  materialList: state => state.user.materialList,
  userInfo: state => state.user.userInfo,
  hasLogin: state => !!state.user.accessToken,
  // 数据字典
  dictData: state => state.dict.dictDatas
}
export default getters
