import { expect } from 'chai'
import {HalloClient} from "@/halloClient";

describe("halloClient basic test", () => {
    it("test constructor", async () => {
        expect(new HalloClient("http://test-hallo/").url).to.be.equal("http://test-hallo");
        expect(new HalloClient("http://test-hallo1").url).to.be.equal("http://test-hallo1");
        expect(new HalloClient("test-hallo2").url).to.be.equal("test-hallo2");
        expect(new HalloClient("test-hallo3/").url).to.be.equal("test-hallo3");

        // TODO test env
    });

    it("test withPath", async () => {
        const client = new HalloClient("test-hallo");
        expect(client.withPath("abc/def")).to.be.equal("test-hallo/abc/def");
        expect(client.withPath("/abc")).to.be.equal("test-hallo/abc");
    });
})
