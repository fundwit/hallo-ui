import axios from 'axios';
import adapter from "axios/lib/adapters/http";

axios.defaults.adapter = adapter;

export class HalloClient {
    constructor(url) {
        if (url === undefined || url === "") {
            url = process.env.REACT_APP_API_BASE_URL;
        }
        if (url.endsWith("/")) {
            url = url.substr(0, url.length - 1)
        }
        this.url = url
    }

    withPath(path) {
        if (!path.startsWith("/")) {
            path = "/" + path
        }
        return `${this.url}${path}`
    }

    async queryEmailOccupied(email) {
        return axios.post(this.withPath("/registry/emails"), {
            email: email
        }).then(r => r.data);
    }
    async queryUsernameOccupied(username) {
        return axios.post(this.withPath("/registry/usernames"), {
            username: username
        }).then(r => r.data);
    }

    async signUp(username, secret) {
        return axios.post(this.withPath("/users"), {
            username: username,
            secret: secret
        }, {validateStatus: null});
    }

    async login(username, secret) {
        return axios.post(this.withPath("/sessions"), {
            username: username,
            secret: secret
        }, {validateStatus: null});
    }

    async currentSession(token) {
        return axios.get(this.withPath("/sessions/current"), {
            headers: {
                "Authorization": 'Bearer ' + token
            },
            validateStatus: null
        });
    }

    async logout(token) {
        return axios.delete(this.withPath("/sessions"), {
            headers: {
                "Authorization": 'Bearer ' + token
            },
            validateStatus: null
        });
    }
}

export default new HalloClient('/api');
