class AddOwnerToBots < ActiveRecord::Migration[5.1]
  def change
    add_reference :bots, :owner, foreign_key: { to_table: :users }
  end
end
