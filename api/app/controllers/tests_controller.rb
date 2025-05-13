class TestsController < ApplicationController
  def index
    @tests = current_user.tests
    render json: @tests
  end

  def create
    @test = current_user.tests.build(test_params)
    if @test.save
      render json: @test, status: :created
    else
      render json: @test.errors, status: :unprocessable_entity
    end
  end

  private

  def test_params
    params.require(:test).permit(:title)
  end
end 