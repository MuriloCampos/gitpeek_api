defmodule GitpeekApi.Repo do
  use Ecto.Repo,
    otp_app: :gitpeek_api,
    adapter: Ecto.Adapters.Postgres
end
