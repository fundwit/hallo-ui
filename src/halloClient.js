import axios from 'axios';
import adapter from "axios/lib/adapters/http";

axios.defaults.adapter = adapter;

export class HalloClient {
    constructor(url) {
        if (url === undefined || url === "") {
            url = process.env.API_BASE_URL;
        }
        if (url === undefined) {
            url = ""
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
    async queryNameOccupied(name) {
        return axios.post(this.withPath("/registry/names"), {
            name: name
        }).then(r => r.data);
    }

    async signUp(name, email, registerToken, secret) {
        return axios.post(this.withPath("/accounts"), {
            name: name,
            email: email,
            register_token: registerToken,
            secret: secret
        }, {validateStatus: null});
    }

    async login(name, secret) {
        return axios.post(this.withPath("/sessions"), {
            name: name,
            secret: secret
        }, {validateStatus: null});
    }

    async currentSession(token) {
        return axios.get(this.withPath("/sessions/me"), {
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

export default new HalloClient('/api/');
