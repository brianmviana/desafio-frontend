<template>
    <div class="sign-up">
        <p>Vamos criar uma nova conta !</p>
        <input type="text" v-model="email" placeholder="E-mail"><br>
        <input type="password" v-model="password" placeholder="Senha"><br>
        <button @click="signUp">Inscrever-se</button>
        <span>ou volte para <router-link to="/login">login</router-link>.</span>
    </div>
</template>

<script>
    import firebase from 'firebase';
    export default {
        name: 'SignUp',
        data() {
            return {
                email: '',
                password: ''
            }
        },
        methods: {
            signUp: function() {
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
                    (user) => {
                        this.$router.replace('home')
                    },
                    (err) => {
                        alert('Oops. ' + err.message)
                    }
                );
            }
        }
    }
</script>

<style scoped>
    div{
        margin:auto;
        text-align: center;
    }
    .sign-up {
        margin-top: 40px;
    }
    input {
        margin: 10px 0;
        width: 20%;
        padding: 15px;
    }
    button {
        margin-top: 10px;
        width: 10%;
        cursor: pointer;
    }
    span {
        display: block;
        margin-top: 20px;
        font-size: 11px;
    }
</style>
