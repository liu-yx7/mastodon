# frozen_string_literal: true

class AiService
  def initialize(api_key = ENV['AI_API_KEY'])
    @api_key = api_key
  end

  def chat(message)
    # TODO: Implement actual AI integration here
    # This is a placeholder that should be replaced with real AI service integration
    # For example, using OpenAI:
    # response = OpenAI::Client.new(api_key: @api_key).chat(
    #   parameters: {
    #     model: "gpt-3.5-turbo",
    #     messages: [{ role: "user", content: message }]
    #   }
    # )
    # return response.dig("choices", 0, "message", "content")
    
    { content: "I am a demo AI assistant. This is a placeholder response." }
  end

  private

  attr_reader :api_key
end