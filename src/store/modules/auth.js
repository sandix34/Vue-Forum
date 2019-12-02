import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  namespaced: true,

  state: {
    authId: null,
    unsubscribeAuthObserver: null
  },

  getters: {
    authUser (state, getters, rootState) {
      return state.authId ? rootState.users.items[state.authId] : null
    }
  },

  actions: {
    initAuthentication ({dispatch, commit, state}) {
      return new Promise((resolve, reject) => {
        // unsubscribe observer if already listening
        if (state.unsubscribeAuthObserver) {
          state.unsubscribeAuthObserver()
        }

        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          console.log('👣 the user has changed')
          if (user) {
            dispatch('fetchAuthUser')
              .then(dbUser => resolve(dbUser))
          } else {
            resolve(null)
          }
        })
        commit('SET_UNSUBSCRIBE_AUTH_OBSERVER', unsubscribe)
      })
    },

    registerUserWithEmailAndPassword ({dispatch}, {email, name, username, password, avatar = null}) {
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(user => {
          return dispatch('users/createUser', {id: user.user.uid, email, name, username, password, avatar}, {root: true})
        })
        .then(() => dispatch('fetchAuthUser'))
    },

    signInWithEmailAndPassword (context, {email, password}) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    signInWithGoogle ({dispatch}) {
      const provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
        .then(data => {
          const user = data.user
          firebase.database().ref('users').child(user.uid).once('value', snapshot => {
            if (!snapshot.exists()) {
              return dispatch('users/createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL}, {root: true})
                .then(() => dispatch('fetchAuthUser'))
            }
          })
        })
    },

    signOut ({commit}) {
      return firebase.auth().signOut()
        .then(() => {
          commit('SET_AUTH_ID', null)
        })
    },

    fetchAuthUser ({dispatch, commit}) {
      const userId = firebase.auth().currentUser.uid
      return new Promise((resolve, reject) => {
        // check if user exists in the database
        firebase.database().ref('users').child(userId).once('value', snapshot => {
          if (snapshot.exists()) {
            return dispatch('users/fetchUser', {id: userId}, {root: true})
              .then(user => {
                commit('SET_AUTH_ID', userId)
                resolve(user)
              })
          } else {
            resolve(null)
          }
        })
      })
    }
  },
  mutations: {
    SET_AUTH_ID (state, id) {
      state.authId = id
    },
    SET_UNSUBSCRIBE_AUTH_OBSERVER (state, unsubscribe) {
      state.unsubscribeAuthObserver = unsubscribe
    }
  }
}
