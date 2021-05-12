import { default as path, extname } from 'path'
import { defineConfig } from 'vite'

import svelte from '@sveltejs/vite-plugin-svelte'
import { createFilter } from '@rollup/pluginutils'
import image from '@rollup/plugin-image'
import svelteSVG from 'rollup-plugin-svelte-svg'
import sveltePreprocess from 'svelte-preprocess'

const dev = process.env.NODE_ENV === 'development'
const resolve = relativePath => path.resolve(__dirname, relativePath)

const commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString()

const svgPlugin = svelteSVG({ dev })
const originSVGPluginTransform = svgPlugin.transform
const filter = createFilter()

// @ref https://riez.medium.com/svelte-kit-importing-svg-as-svelte-component-781903fef4ae
svgPlugin.transform = (source, id) => {
    if (!filter(id) || extname(id) !== '.svg') return null

    source = decodeURIComponent(source)
        .replace('</svg>";', '</svg>')
        .replace('export default img;', '')
    const { code: transformed, map } = originSVGPluginTransform(source, id)
    const className = transformed.match('export default (.*);')[1]

    return {
        code: transformed.replace(
            `export default ${ className }`,
            `${ className }.$$$render = () => '';export default ${ className };`
        ),
        map
    }
}

export default defineConfig({
    base: './',
    resolve: {
        alias: { '@': resolve('src') }
    },
    plugins: [
        svelte({
            emitCss: true,
            preprocess: sveltePreprocess({
                aliases: [['@', resolve('src')]]
            })
        }),
        { ...image(), enforce: 'pre' },
        svgPlugin
    ],
    rollupDeupe: ['svelte'],
    define: {
        __COMMIT_HASH__: JSON.stringify(commitHash)
    }
})