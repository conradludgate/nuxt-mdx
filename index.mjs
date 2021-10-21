import { defineNuxtModule, addVitePlugin, addWebpackPlugin } from '@nuxt/kit'
import { createUnplugin } from 'unplugin'
import { compile } from '@mdx-js/mdx';
import { transformAsync } from '@babel/core'

async function transform(options, code) {
    const jsx = await compile(code, {jsx: true, outputFormat: 'function-body', ...options})
    const wrap = `const { default: render, ...rest } = (() => {${String(jsx)}})()

export default {
    ...rest,
    inject: ["$mdxComponents"],
    render() {
        return render({components: this.$mdxComponents, ...rest})
    }
}`;
    const js = await transformAsync(wrap, {plugins: ['@vue/babel-plugin-jsx']});
    return js?.code;
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
