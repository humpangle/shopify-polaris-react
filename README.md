I scanned the polaris-react page. My understanding is it's just a regular react app where you use components from polaris-react and follow some conventions on design. If you are going to be serving your shopify app from a website not powered by phoenix e.g the shopify admin, then you may do as @adrianrl suggested.

However if you need to serve your shopify from a phoenix-powered site e.g your marketing website written in phoenix and you'd like to take users to your shopify app when a link/button is clicked, then you may follow this simple tutorial that I put together.

I took shopify's example from [here](https://github.com/Shopify/polaris-react/tree/master/examples/create-react-app) and served it from a phoenix app.

1. mkdir shopify-polaris-react
2. cd shopify-polaris-react
3. npx create-react-app shopify-polaris-react
4. mv shopify-polaris-react front-end
5. mix phx.new back-end --app shopify
6. cd front-end
7. yarn add @shopify/polaris
8. Replaced contents of front-end/src with contents from https://github.com/Shopify/polaris-react/tree/master/examples/create-react-app/src
9. In react app root, run:
   `echo "REACT_APP_API_URL=http://localhost:4000/api" > .env`
   Note: `http://localhost:4000/` is where your phoenix app is running.
   `http://localhost:4000/api` is where we will post requests from react app
10. yarn start (to ensure your react-app works fine)
    - if you get some css error, you may want to take a look at https://github.com/Shopify/polaris-react/issues/441. It has something to do with a bug in post-css-loader. What I did was to:
      a. `yarn eject`
      b. removed the post-css parts of the webpack configs (dev and prod)
      c. `yarn start`
11. `cd back-end\` (root of phoenix app)
12. Add `{:corsica, "~> 1.1"}` to `mix.exs` so we can handle CORS request from react app (running on another port) during development
13. `mix ecto.create`
14. `iex -S mix phx.server` (to ensure phoenix app works)
15. create a plug in `endpoint.ex` to serve `priv/shopify-app/index.html` for the route `/shopify-app`:

```elixir
def serve_shopify_app(conn, _opts) do
  case conn.path_info do
    ["shopify-app"] ->
	%{
		conn
		| path_info: ["shopify-app", "index.html"],
		 request_path: "/shopify-app/index.html"
	}

    _ ->
     conn
  end
end
```

15. add the plug `plug(:serve_shopify_app)` before `plug(Plug.Static,...` in `endpoint.ex`
16. In `front-end/package.json`, add key `homepage` with value `shopify-app` (your react app will then be served from `/shopify-app` when deployed in phoenix)
17. from react app root, run:
    `yarn build && rm -rf ..\back-end\priv\static\shopify-app && cp -r build\ ..\back-end\priv\static\shopify-app`
    (You may create an npm task for this)
18. Test that you can access your react app from phoenix by pointing your browser to `http://localhost:4000/shopify-app`
19. Take a look at `front-end/src/App.js`. You will find an example of how to submit form to phoenix at `http://localhost:4000/api/form`. Phoenix will dispatch to router.ex

```elixir
scope "/api", ShopifyWeb do
    pipe_through(:api)

    post("/form", PageController, :form)
end
```

and in `page_controller.ex`, you can handle like so:

```elixir
def form(conn, params) do
    json(conn, params)
end
```

20. Then just add a link to `/shopify-app` from any phoenix-served page (like I did in `back-end/lib/shopify_web/templates/layout/app.html.eex`)

21. I created a [github repo](https://github.com/samba6/shopify-polaris-react)
