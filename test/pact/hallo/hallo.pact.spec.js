import path from "path";
import {Pact} from "@pact-foundation/pact";
import {like, email} from "@pact-foundation/pact/dsl/matchers";
import {HalloClient} from "./halloClient";

const provider = new Pact({
    consumer: 'hallo-ui',
    provider: 'hallo',
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    logLevel: "warn",
    dir: path.resolve(process.cwd(), 'pacts'),
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
                state: 'email not occupied',
                uponReceiving: 'check email for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/emails',
                    body: like({
                        email: email('available@test-email.com')
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: like({
                        email: email('available@test-email.com'),
                        occupied: false
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryEmailOccupied('available@test-email.com');
            expect(occupied).toStrictEqual(
                { email: 'available@test-email.com', occupied: false}
            );
        });

        test("email occupied", async () => {
            await provider.addInteraction({
                state: 'email occupied',
                uponReceiving: 'check email for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/emails',
                    body: like({
                        email: email('occupied@test-email.com')
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: like({
                        email: email('occupied@test-email.com'),
                        occupied: true
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryEmailOccupied('occupied@test-email.com');
            expect(occupied).toStrictEqual(
                { email: 'occupied@test-email.com', occupied: true}
            );
        });
    });

    describe("username check for registry", () => {
        test("username not occupied", async () => {
            await provider.addInteraction({
                state: 'username not occupied',
                uponReceiving: 'check username for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/usernames',
                    body: like({
                        username: 'Ann'
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: like({
                        username: 'Ann',
                        occupied: false
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryUsernameOccupied('Ann');
            expect(occupied).toStrictEqual(
                { username: 'Ann', occupied: false}
            );
        });

        test("username occupied", async () => {
            await provider.addInteraction({
                state: 'username occupied',
                uponReceiving: 'check username for registry',
                withRequest: {
                    method: 'POST',
                    path: '/registry/usernames',
                    body: like({
                        username: 'Ann'
                    })
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: like({
                        username: 'Ann',
                        occupied: true
                    }),
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const occupied = await client.queryUsernameOccupied('Ann');
            expect(occupied).toStrictEqual(
                { username: 'Ann', occupied: true}
            );
        });
    });

    describe("login", () => {
        test("login success", async () => {
            await provider.addInteraction({
                state: 'success login',
                uponReceiving: 'login request',
                withRequest: {
                    method: 'POST',
                    path: '/sessions',
                    body: like({
                        username: 'Ann',
                        secret: 'correctSecret'
                    })
                },
                willRespondWith: {
                    status: 200,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.login('Ann', 'correctSecret');
            expect(response.status).toStrictEqual(200);
        });

        test("login failed", async () => {
            await provider.addInteraction({
                state: 'failed login',
                uponReceiving: 'login request',
                withRequest: {
                    method: 'POST',
                    path: '/sessions',
                    body: like({
                        username: 'Ann',
                        secret: 'badSecret'
                    })
                },
                willRespondWith: {
                    status: 401,
                },
            });

            const client = new HalloClient(provider.mockService.baseUrl);
            const response = await client.login('Ann', 'badSecret');
            expect(response.status).toStrictEqual(401);
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
            const response = await client.logout();
            expect(response.status).toStrictEqual(204);
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
            const response = await client.logout();
            expect(response.status).toStrictEqual(204);
        });
    });
});
