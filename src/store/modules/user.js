const user = {
    state: {
        token: '',
        username: '',
        avatar: '',
        sex: '',
        birthday: '',
        email: '',
        id: '',
        realname: '',
        userIdentity: '',
        tenantid: '',
        welcome: '',
        permissionList: [],
        info: {},
        // 系统安全模式
        sysSafeMode: null,
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            localStorage.setItem('token', token)
            state.token = token
        },
        SET_AVATAR: (state, avatar) => {
            localStorage.setItem('avatar', avatar)
            state.avatar = avatar
        },
        SET_USERNAME: (state, username) => {
            localStorage.setItem('username', username)
            state.username = username
        },
        SET_SEX: (state, sex) => {
            localStorage.setItem('sex', sex)
            state.sex = sex
        },
        SET_BIRTHDAY: (state, birthday) => {
            localStorage.setItem('birthday', birthday)
            state.birthday = birthday
        },
        SET_EMAIL: (state, email) => {
            localStorage.setItem('email', email)
            state.email = email
        },
        SET_ID: (state, id) => {
            localStorage.setItem('id', id)
            state.id = id
        },
        SET_USERIDENTITY: (state, userIdentity) => {
            localStorage.setItem('userIdentity', userIdentity)
            state.userIdentity = userIdentity
            console.log("userIdentity" + localStorage.getItem('userIdentity'))
        },
    },
    getters: {
        GET_TOKEN(state) {
            return (state.token === '' ? localStorage.getItem('token') : state.token)
        },
        GET_AVATAR(state) {
            return (state.avatar === '' ? localStorage.getItem('avatar') : state.avatar)
        },
        GET_USERNAME(state) {
            return (state.username === '' ? localStorage.getItem('username') : state.username)
        },
        GET_SEX(state) {
            return (state.sex === '' ? localStorage.getItem('sex') : state.sex)
        },
        GET_BIRTHDAY(state) {
            return (state.birthday === '' ? localStorage.getItem('birthday') : state.birthday)
        },
        GET_EMAIL(state) {
            return (state.email === '' ? localStorage.getItem('email') : state.email)
        },
        GET_ID(state) {
            return (state.id === '' ? localStorage.getItem('id') : state.id)
        },

        GET_USERIDENTITY(state) {
            return (state.userIdentity === '' ? localStorage.getItem('userIdentity') : state.userIdentity)
        },


    }
}
export default user