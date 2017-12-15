class BotPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    true
  end

  def update?
    is_owner?
  end

  def destroy?
    is_owner?
  end

  def publish?
    is_owner?
  end

  def unpublish?
    is_owner?
  end

  def preview?
    true
  end

  def read_session_data?
    is_owner?
  end

  def read_usage_stats?
    is_owner?
  end

  def read_channels?
    is_owner?
  end

  def read_behaviours?
    is_owner?
  end

  def create_skill?
    is_owner?
  end

  def read_translations?
    is_owner?
  end

  def update_translation?
    is_owner?
  end

  def is_owner?
    record.owner_id == user.id
  end

  def permitted_attributes
    [:name]
  end

  class Scope < Scope
    def resolve
      scope.where(owner_id: user.id)
    end
  end
end
