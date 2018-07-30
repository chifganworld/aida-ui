class AddResolvedToNotifications < ActiveRecord::Migration[5.1]
  def change
    add_column :notifications, :resolved, :boolean, default: false
  end
end
