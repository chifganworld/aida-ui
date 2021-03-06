require 'rails_helper'

RSpec.describe Bot, type: :model do
  let(:user) { User.create!(email: "user@example.com") }

  it "can create bot" do
    bot = Bot.create_prepared!(user)
    expect(bot).to_not be_nil
    expect(bot).to be_valid
  end

  it "has not default channels" do
    bot = Bot.create_prepared!(user)
    expect(bot.channels.size).to eq(0)
  end

  describe "manifest" do
    let!(:bot) { Bot.create_prepared! user }
    let!(:skill) { bot.skills.create_skill! 'keyword_responder' }

    describe "manifest" do
      it "is generated" do
        manifest = bot.manifest
        expect(manifest).to_not be_nil
        expect(manifest[:version]).to eq("1")
        expect(manifest.keys).to match_array(%i(version languages front_desk skills variables channels notifications_url))
      end

      it "has a public_keys section if the owner has a key pair" do
        user.update_attributes! public_key: "public_key", encrypted_secret_key: "secret"
        expect(bot.manifest.keys).to include(:public_keys)
      end

      it "has a data_tables section if the bot has tables" do
        create(:data_table, bot: bot)
        expect(bot.manifest.keys).to include(:data_tables)
      end

      it "has a proper notifications_url" do
        expect(bot.manifest[:notifications_url]).to eq(URI::parse("http://ui.aidaui.lvh.me:3000/notifications/#{bot.notifications_secret}"))
      end
    end

    it "outputs all channels" do
      bot.channels.create! kind: "facebook", name: "facebook", config: {
        "page_id" => "", "verify_token" => SecureRandom.base58, "access_token" => ""
      }
      bot.channels.create! kind: "websocket", name: "websocket", config: {
        "access_token" => "",
        "url_key" => ""
      }
      bot.channels.create! kind: "websocket", name: "websocket", config: {
        "access_token" => "",
        "url_key" => ""
      }

      expect(bot.manifest[:channels].size).to eq(3)
    end

    it "outputs channels ordered by id" do
      channel_1 = bot.channels.create! kind: "websocket", name: "websocket", config: {
        "access_token" => "",
        "url_key" => ""
      }
      channel_0 = bot.channels.create! kind: "websocket", name: "websocket", config: {
        "access_token" => "",
        "url_key" => ""
      }
      channel_0.config = {
        "access_token" => "#{channel_0.id}",
        "url_key" => ""
      }
      channel_0.save!

      channel_1.id = (channel_0.id + 1)
      channel_1.config = {
        "access_token" => "#{channel_1.id}",
        "url_key" => ""
      }
      channel_1.save!

      channels = bot.manifest[:channels]
      expect(channels[1]['access_token'].to_i).to eq(channels[0]['access_token'].to_i + 1)
    end

    it "does not expose url_key" do
      channel = bot.channels.create! kind: "websocket", name: "websocket", config: {
        "access_token" => "an access token",
        "url_key" => "a url key"
      }
      expect(bot.manifest[:channels][0]['url_key']).to be_nil
    end

    it "outputs wit_ai" do
      bot.wit_ai_auth_token = 'an auth token'
      bot.save!

      responder = bot.skills.create_skill! 'keyword_responder'
      responder[:config][:use_wit_ai] = true
      responder.save!

      wit_ai = bot.manifest[:natural_language_interface]

      expect(wit_ai).to be_truthy
      expect(wit_ai[:provider]).to eq('wit_ai')
      expect(wit_ai[:auth_token]).to eq('an auth token')
    end

    it "does not output wit_ai when unnecessary" do
      bot.wit_ai_auth_token = 'an auth token'
      bot.save!

      wit_ai = bot.manifest[:natural_language_interface]

      expect(wit_ai).to be_nil
    end

    it "outputs channels with config type" do
      bot.channels.create! kind: "facebook", name: "facebook", config: {
        "page_id" => "", "verify_token" => SecureRandom.base58, "access_token" => ""
      }
      bot.channels.create! kind: "websocket", name: "websocket", config: {
        "access_token" => "",
        "url_key" => ""
      }
      bot.channels.create! kind: "websocket", name: "websocket", config: {
        "access_token" => "",
        "url_key" => ""
      }

      expect(bot.manifest[:channels].all? { |channel| not channel[:type].nil? }).to be true
    end

    it "outputs only enabled skills" do
      expect(bot.manifest[:skills].size).to eq(1)
      skill.update_attributes! enabled: false
      bot.reload
      expect(bot.manifest[:skills].size).to eq(0)
    end

    describe "with multiple languages" do
      let!(:language_detector) {
        bot.skills.create_skill! 'language_detector',
                                 config: {
                                   languages: [
                                     {code: 'en', keywords: 'en'},
                                     {code: 'es', keywords: 'es'}
                                   ]
                                 }
      }

      it "outputs available languages" do
        expect(bot.manifest[:languages]).to match_array(['en', 'es'])
      end

      it "outputs localized messages with their translations" do
        bot.front_desk.update_attributes! config: {
                                            "greeting" => "Hi!",
                                            "introduction" => "I'm a bot",
                                            "not_understood" => "I don't understand",
                                            "clarification" => "Please repeat",
                                            "threshold" => 0.5,
                                            "unsubscribe_introduction_message" => "send UNS to unsubscribe",
                                            "unsubscribe_keywords" => "UNS",
                                            "unsubscribe_acknowledge_message" => "Successfully unsubscribed"
                                          }
        bot.front_desk.translations.create! key: 'greeting', lang: 'es', value: 'Hola'

        manifest = bot.manifest.with_indifferent_access
        expect(manifest[:front_desk][:greeting]).to match({ message: { en: 'Hi!', es: 'Hola' }})
      end
    end
  end

  describe "available_languages" do
    let!(:bot) { Bot.create_prepared! user }

    it "returns a single language if the bot has no language detector" do
      expect(bot.language_detector).to be_nil
      expect(bot.available_languages).to eq(['en'])
    end

    it "returns the list of configured languages in the language detector" do
      bot.skills.create_skill! 'language_detector',
                               config: {
                                 languages: [
                                   {code: 'en', keywords: 'en'},
                                   {code: 'es', keywords: 'es'}
                                 ]
                               }
      expect(bot.language_detector).to_not be_nil
      expect(bot.available_languages).to eq(['en', 'es'])
    end

    it "returns a single language if the bot has a disable language detector" do
      bot.skills.create_skill! 'language_detector',
                               enabled: false,
                               config: {
                                 languages: [
                                   {code: 'en', keywords: 'en'},
                                   {code: 'es', keywords: 'es'}
                                 ]
                               }
      expect(bot.language_detector).to be_nil
      expect(bot.available_languages).to eq(['en'])
    end
  end

  describe "translation_keys" do
    let!(:bot) { Bot.create_prepared! user }

    it "returns front_desk translations for a bot with no skills" do
      keys = bot.translation_keys

      expect(keys).to be_an(Array)
      expect(keys.size).to eq(1)
      expect(keys.first[:id]).to eq(bot.front_desk.id)
      expect(keys.first[:keys]).to match(bot.front_desk.translation_keys)
    end

    it "returns all skills translation keys" do
      # language detector has no translatable keys
      bot.skills.create_skill! 'language_detector', order: 1
      skill_2 = bot.skills.create_skill! 'keyword_responder', order: 2
      keys = bot.translation_keys

      expect(keys).to be_an(Array)
      expect(keys.size).to eq(2)
      expect(keys[0][:id]).to eq(bot.front_desk.id)
      expect(keys[1][:id]).to eq(skill_2.id)
    end
  end
end
