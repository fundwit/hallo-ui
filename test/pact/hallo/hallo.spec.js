import {email, like} from "@pact-foundation/pact/dsl/matchers";
import {HalloClient} from "./halloClient";

describe("halloClient basic test", () => {
    test("test constructor", async () => {
        process.env.REACT_APP_API_BASE_URL="http://test-hallo/"
        expect(new HalloClient().url).toStrictEqual("http://test-hallo");

        process.env.REACT_APP_API_BASE_URL="http://test-hallo1"
        expect(new HalloClient("").url).toStrictEqual("http://test-hallo1");

        expect(new HalloClient("test-hallo2").url).toStrictEqual("test-hallo2");

        expect(new HalloClient("test-hallo3/").url).toStrictEqual("test-hallo3");
    });

    test("test withPath", async () => {
        const client = new HalloClient("test-hallo");
        expect(client.withPath("abc/def")).toStrictEqual("test-hallo/abc/def");
        expect(client.withPath("/abc")).toStrictEqual("test-hallo/abc");
    });

})
