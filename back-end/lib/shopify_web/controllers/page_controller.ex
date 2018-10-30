defmodule ShopifyWeb.PageController do
  use ShopifyWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def form(conn, params) do
    json(conn, params)
  end
end
