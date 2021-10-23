import { defineNuxtModule, addVitePlugin, addWebpackPlugin } from '@nuxt/kit'
import { createUnplugin } from 'unplugin'
import { compile } from '@mdx-js/mdx';
import { transformAsync } from '@babel/core'

async function transform(options, code) {
    const jsx = await compile(code, {jsx: true, ...options})
    const js = (await transformAsync(jsx, {plugins: ['@vue/babel-plugin-jsx']})).code
        .replace("\nexport default MDXContent;", "")
        .replace("export const ", "const exports = {};\nexports.")
        .replaceAll("export const ", "exports.");

    return `${js}

    export const meta = exports;
    export default {
        ...exports,
        inject: ["$mdxComponents"],
        render() {
            return MDXContent({components: this.$mdxComponents, ...exports})
        }
    }`;
}

const mdxLoader = createUnplugin((options) => ({
    name: 'nuxt-mdx-loader',
    enforce: "pre",
    transformInclude(id) {
        return id.endsWith('.mdx')
    },
    transform(code) {
        return transform(options, code)
    }
}))

export default defineNuxtModule({
    name: "nuxt-mdx",
    setup(options, nuxt) {
        const { extensions } = nuxt.options
        if (extensions && !extensions.includes('.mdx')) {
            extensions.push('.mdx')
        }

        addWebpackPlugin(mdxLoader.webpack(options))
        addVitePlugin(mdxLoader.vite(options))
    }
})
