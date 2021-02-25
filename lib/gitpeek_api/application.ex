defmodule GitpeekApi.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      GitpeekApi.Repo,
      # Start the Telemetry supervisor
      GitpeekApiWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: GitpeekApi.PubSub},
      # Start the Endpoint (http/https)
      GitpeekApiWeb.Endpoint
      # Start a worker by calling: GitpeekApi.Worker.start_link(arg)
      # {GitpeekApi.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: GitpeekApi.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    GitpeekApiWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
