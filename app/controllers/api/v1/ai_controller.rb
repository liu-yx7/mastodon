# frozen_string_literal: true

class Api::V1::AiController < Api::BaseController
  before_action :require_user!

  def chat
    response = AiService.new.chat(params[:message])
    render json: response
  end

  private

  def require_user!
    render json: { error: 'This API requires authentication' }, status: 401 unless current_user
  end
end