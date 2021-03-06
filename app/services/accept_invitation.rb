class AcceptInvitation
  def self.run(invitation, user)
    if !invitation.anonymous? and user.email != invitation.email
      fail "user does not match invitation"
    end

    Invitation.transaction do
      bot = invitation.bot
      collaborator = bot.collaborators.create! user: user, roles: invitation.roles
      invitation.destroy!
      collaborator
    end
  end
end
