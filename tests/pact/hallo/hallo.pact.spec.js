/**
 * https://github.com/pact-foundation/pact-js
 * can not run in browser
 */

import {expect} from 'chai'
import path from "path";
import {Pact} from "@pact-foundation/pact";
import {like, email} from "@pact-foundation/pact/dsl/matchers";
import {HalloClient} from "../../../src/halloClient";

const provider =
    new Pact({
        consumer: 'hallo-ui',
        provider: 'hallo',
        // port: port
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        logLevel: "warn",
        dir: path.resolve(process.cwd(), 'pacts'),
        pactfileWriteMode: "overwrite",
        spec: 2
    });

describe("hallo-ui and hallo Pact test", () => {
    beforeAll(() => {
        return provider.setup();
    });
    afterEach(async () => {
        await provider.verify();
    });
    afterAll(async () => {
        return provider.finalize();
    });

    describe("email check for registry", () => {
        test("email not occupied", async () => {
            await provider.addInteraction({
                state: 'email [available@test.fundwit.com] not occupied',
                uponReceiving: 'check email for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/emails',
                    body: like({
                        email: email('available@test.fundwit.com')
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: like({
                        email: email('available@test.fundwit.com'),
                        occupied: false
                    }),

                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryEmailOccupied('available@test.fundwit.com');
            expect(occupied).to.deep.equal(
                { email: 'available@test.fundwit.com', occupied: false}
            );
        });

        test("email occupied", async () => {
            await provider.addInteraction({
                state: 'email [occupied@test.fundwit.com] occupied',
                uponReceiving: 'check email for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/emails',
                    body: like({
                        email: email('occupied@test.fundwit.com')
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: like({
                        email: email('occupied@test.fundwit.com'),
                        occupied: true
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryEmailOccupied('occupied@test.fundwit.com');
            expect(occupied).to.deep.equal(
                { email: 'occupied@test.fundwit.com', occupied: true}
            );
        });
    });

    describe("account name check for registry", () => {
        test("account name not occupied", async () => {
            await provider.addInteraction({
                state: 'account name [Ann] not occupied',
                uponReceiving: 'check account name for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/names',
                    body: like({
                        name: 'Ann'
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: like({
                        name: 'Ann',
                        occupied: false
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryNameOccupied('Ann');
            expect(occupied).to.deep.equal(
                { name: 'Ann', occupied: false}
            );
        });

        test("account name occupied", async () => {
            await provider.addInteraction({
                state: 'account name [Bob] occupied',
                uponReceiving: 'check account name for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/names',
                    body: like({
                        name: 'Bob'
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: like({
                        name: 'Bob',
                        occupied: true
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryNameOccupied('Bob');
            expect(occupied).to.deep.equal(
                { name: 'Bob', occupied: true}
            );
        });
    });

    describe("sign up", () => {
        test("sign up success", async () => {
            await provider.addInteraction({
                state: 'sign up success with parameters [Ann, email-sign-up@test.fundwit.com, correct_register_token, correctSecret]',
                uponReceiving: 'sign up request',
                withRequest: {
                    method: 'POST',
                    path: '/accounts',
                    body: like({
                        name: 'Ann',
                        email: 'email-sign-up@test.fundwit.com',
                        register_token: 'correct_register_token',
                        secret: 'correctSecret'
                    })
                },
                willRespondWith: {
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    status: 201,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.signUp('Ann', 'email-sign-up@test.fundwit.com', 'correct_register_token','correctSecret');
            expect(response.status).to.deep.equal(201);
        });

        test("sign up failed", async () => {
            await provider.addInteraction({
                state: 'failed sign up',
                uponReceiving: 'sign up request',
                withRequest: {
                    method: 'POST',
                    path: '/accounts',
                    body: like({
                        name: 'Ann',
                        email: 'bad-email@test.fundwit.com',
                        register_token: 'bad_register_token',
                        secret: 'badSecret'
                    })
                },
                willRespondWith: {
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    status: 400,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.signUp('Ann', 'bad-email@test.fundwit.com', 'bad_register_token', 'badSecret');
            expect(response.status).to.deep.equal(400);
        });
    });

    describe("login", () => {
        test("login success", async () => {
            await provider.addInteraction({
                state: 'success login with credential [Ann, correctSecret]',
                uponReceiving: 'login request',
                withRequest: {
                    method: 'POST',
                    path: '/sessions',
                    body: like({
                        name: 'Ann',
                        secret: 'correctSecret'
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: like({
                        token: 'correctToken',
                        principal: like({
                            name: 'Ann'
                        })
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.login('Ann', 'correctSecret');
            expect(response.status).to.deep.equal(200);
            expect(response.data).to.deep.equal(
                { token: 'correctToken', principal: {name: 'Ann'}}
            );
        });

        test("login failed", async () => {
            await provider.addInteraction({
                state: 'failed login with credential [Ann, badSecret]',
                uponReceiving: 'login request',
                withRequest: {
                    method: 'POST',
                    path: '/sessions',
                    body: like({
                        name: 'Ann',
                        secret: 'badSecret'
                    })
                },
                willRespondWith: {
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    status: 401,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.login('Ann', 'badSecret');
            expect(response.status).to.deep.equal(401);
        });
    });

    describe("session info", () => {
        test("session info - success", async () => {
            await provider.addInteraction({
                state: 'already login for session info',
                uponReceiving: 'session info request',
                withRequest: {
                    method: 'GET',
                    path: '/sessions/me',
                    headers: {
                        "Authorization": like("Bearer correctToken"),
                    }
                },
                willRespondWith: {
                    status: 200,
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    body: like({
                        token: 'correctToken',
                        principal: like({
                            name: 'Ann'
                        })
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.currentSession();
            expect(response.status).to.deep.equal(200);
            expect(response.data).to.deep.equal(
                { token: 'correctToken', principal: {name: 'Ann'}}
            );
        });

        test("session info - un-login", async () => {
            await provider.addInteraction({
                state: 'un-login for session info',
                uponReceiving: 'session info request',
                withRequest: {
                    method: 'GET',
                    path: '/sessions/me',
                },
                willRespondWith: {
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    status: 401,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.currentSession(null);
            expect(response.status).to.deep.equal(401);
        });

        test("session info - bad token", async () => {
            await provider.addInteraction({
                state: 'bad token for session info',
                uponReceiving: 'session info request',
                withRequest: {
                    method: 'GET',
                    path: '/sessions/me',
                    headers: {
                        "Authorization": like("Bearer badToken"),
                    }
                },
                willRespondWith: {
                    headers: {'Content-Type': 'application/json; charset=utf-8'},
                    status: 401,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.currentSession('badToken');
            expect(response.status).to.deep.equal(401);
        });
    });


    describe("logout", () => {
        test("logout success", async () => {
            await provider.addInteraction({
                state: 'success logout',
                uponReceiving: 'logout request',
                withRequest: {
                    method: 'DELETE',
                    path: '/sessions',
                    headers: {
                        "Authorization": like("Bearer correctToken"),
                    }
                },
                willRespondWith: {
                    status: 204
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.logout('correctToken');
            expect(response.status).to.deep.equal(204);
        });

        test("logout failed", async () => {
            await provider.addInteraction({
                state: 'failed logout',
                uponReceiving: 'logout request',
                withRequest: {
                    method: 'DELETE',
                    path: '/sessions',
                    headers: {
                        "Authorization": like("badToken"),
                    }
                },
                willRespondWith: {
                    status: 204,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.logout('badToken');
            expect(response.status).to.deep.equal(204);
        });
    });
});
