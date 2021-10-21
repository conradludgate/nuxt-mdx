# nuxt-mdx

MDX loader for Nuxt3.0.


## Installation

Add

```json
"nuxt-mdx": "conradludgate/nuxt-mdx",
```

to your `package.json#dev-depednencies`.

Add

```ts
buildModules: ["nuxt-mdx"]
```

to your `next.config.ts`.

## Usage

Create an `mdx` file in your `pages/` dir

** pages/post.mdx **
```mdx
# Hello World

This is markdown!
```

Running `npx nuxi dev` and opening that page will display the markdown contents.

## Advanced usage

You can customise the rendering of the markdown.

In this example, we're going to render our markdown with some of the html elements being replaced, as well as using some details from the markdown to configure what's displayed.

Let's add these lines to our `pages/post.mdx`

```diff
+ export const layout = "post";
+ export const title = "Amazing Blog Post";

# Hello World

This is markdown!
```

Create a layout in your `layouts` folder to match, eg. `layouts/post.vue`.

The `next-mdx` module automatically configures the output page with the correct layout.

```vue
<script lang="ts">
import BlogPostWrapper from '~~/components/BlogPost.vue';
export default {
  data() {
    return {
      mdxComponents: {
        wrapper: BlogPostWrapper, // wrap the entire post in the BlogPostWrapper
        h1: "h2", // replace all h1 elements with h2
      }
    }
  },

  // provide those components into the vue context
  provide() { return { $mdxComponents: this.mdxComponents } },
};
</script>

<template>
  <slot />
</template>
```

The `$mdxComponents` are automatically injected into the mdx file rendering.

Now, create a component file in your `components` folder, eg. `components/BlogPost.vue`

```vue
<script lang="ts">
export default defineComponent({
  props: {
    title: String,
  }
});
</script>

<template>
  <h1>{{ title }}</h1>
  <slot />
</template>
```

The values returned by the mdx file are automatically inserted as props into the wrapper component.
