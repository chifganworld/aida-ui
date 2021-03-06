# coding: utf-8
require 'rails_helper'

RSpec.describe Behaviour, type: :model do
  let!(:bot) { Bot.create_prepared!(User.create email: 'foo@example.com')}

  def add_languages(*languages)
    bot.skills.create_skill! 'language_detector', config: {
                               languages: languages.map do |lang|
                                 { code: lang, keywords: lang }
                               end
                             }
  end

  describe "front_desk" do
    let!(:front_desk) { bot.front_desk }

    it "creates valid behaviour" do
      front_desk = bot.behaviours.create_front_desk!
      expect(front_desk).to be_valid
    end

    it "generates manifest fragment" do
      fragment = front_desk.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(greeting introduction clarification not_understood threshold unsubscribe))
    end

    it "returns translation keys" do
      keys = front_desk.translation_keys
      expect(keys).to be_an(Array)
      expect(keys.size).to eq(7)
      expect(keys.first.keys).to match_array(%i(key label default_translation))
    end

    it "manifest returns translated messages" do
      add_languages 'en', 'es', 'it'
      front_desk.config["greeting"] = 'Hi'
      front_desk.translations.create! key: 'greeting', lang: 'es', value: 'Hola'
      front_desk.translations.create! key: 'greeting', lang: 'it', value: 'Ciao'
      fragment = front_desk.manifest_fragment.with_indifferent_access
      expect(fragment[:greeting]).to match({ message: { en: 'Hi', es: 'Hola', it: 'Ciao' }})
    end

    it "uses default language for missing translations" do
      add_languages 'en', 'es', 'it'
      front_desk.config["greeting"] = 'Hi'
      fragment = front_desk.manifest_fragment.with_indifferent_access
      expect(fragment[:greeting]).to match({ message: { en: 'Hi', es: 'Hi', it: 'Hi' }})
    end

    it "manifest returns unsubscribe settings" do
      front_desk.config["unsubscribe_introduction_message"] = "intro_mess"
      front_desk.config["unsubscribe_keywords"] = "keyw1, key2"
      front_desk.config["unsubscribe_acknowledge_message"] = "ack_mess"

      fragment = front_desk.manifest_fragment.with_indifferent_access

      expect(fragment[:unsubscribe]).to match({
        introduction_message: {message: { en: 'intro_mess' }},
        keywords: { en: ['keyw1', 'key2'] },
        acknowledge_message: { message: { en: 'ack_mess' }}
      })
    end
  end

  describe "keyword_responder" do
    let!(:responder) { bot.skills.create_skill!('keyword_responder') }

    it "creates valid and enabled skill" do
      expect(responder).to be_valid
      expect(responder).to be_enabled
    end

    it "generates manifest fragment with keywords" do
      responder[:config][:keywords] = 'a_keyword'
      responder.save!

      fragment = responder.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id name explanation keywords response clarification))
      expect(fragment[:keywords]['en']).to eq(['a_keyword'])
    end

    it "generates manifest fragment with training_sentences" do
      responder[:config][:training_sentences] = ['a training sentence']
      responder[:config][:use_wit_ai] = true
      responder.save!

      fragment = responder.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id name explanation training_sentences response clarification))
      expect(fragment[:training_sentences]['en']).to eq(['a training sentence'])
    end

    it "generates manifest fragment with no training_sentences when disabled wit_ai" do
      responder[:config][:training_sentences] = ['a training sentence']
      responder[:config][:use_wit_ai] = false
      responder.save!

      fragment = responder.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:training_sentences]).to be_nil
    end

    it "generates manifest fragment with no keywords when enabled wit_ai" do
      responder[:config][:keywords] = 'a_keyword'
      responder[:config][:use_wit_ai] = true
      responder.save!

      fragment = responder.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:keywords]).to be_nil
    end

    it "returns translation keys" do
      keys = responder.translation_keys
      expect(keys).to be_an(Array)
      expect(keys.size).to eq(4)
      expect(keys.first.keys).to match_array(%i(key label default_translation))
    end

    it "manifest returns translated messages" do
      add_languages 'en', 'es'
      responder.config["keywords"] = "foo, bar"
      responder.translations.create! key: 'keywords', lang: 'es', value: 'baz, quux'
      fragment = responder.manifest_fragment.with_indifferent_access
      expect(fragment[:keywords]).to match({ en: ['foo', 'bar'], es: ['baz', 'quux'] })
    end
  end

  describe "language_detector" do
    let!(:detector) { bot.skills.create_skill!('language_detector') }

    it "creates valid skill" do
      expect(detector).to be_valid
      expect(detector).to be_enabled
    end

    it "generates manifest fragment" do
      fragment = detector.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type explanation reply_to_unsupported_language languages))
    end

    it "has no translation keys" do
      keys = detector.translation_keys
      expect(keys).to be_an(Array)
      expect(keys).to be_empty
    end
  end

  describe "human override" do
    let!(:human) { bot.skills.create_skill!('human_override') }

    it "generates manifest fragment with keywords" do
      human[:config][:keywords] = 'a_keyword'
      human.save!

      fragment = human.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id name explanation keywords clarification in_hours in_hours_response off_hours_response))
      expect(fragment[:keywords]['en']).to eq(['a_keyword'])
    end

    it "generates manifest fragment with training_sentences" do
      human[:config][:training_sentences] = ['a training sentence']
      human[:config][:use_wit_ai] = true
      human.save!

      fragment = human.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id name explanation training_sentences clarification in_hours in_hours_response off_hours_response))
      expect(fragment[:training_sentences]['en']).to eq(['a training sentence'])
    end

    it "generates manifest fragment with no training_sentences when disabled wit_ai" do
      human[:config][:training_sentences] = ['a training sentence']
      human[:config][:use_wit_ai] = false
      human.save!

      fragment = human.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:training_sentences]).to be_nil
    end

    it "generates manifest fragment with no keywords when enabled wit_ai" do
      human[:config][:keywords] = 'a_keyword'
      human[:config][:use_wit_ai] = true
      human.save!

      fragment = human.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:keywords]).to be_nil
    end
  end

  describe "decision tree" do
    let!(:tree) { bot.skills.create_skill!('decision_tree') }

    it "generates manifest fragment with keywords" do
      tree[:config][:keywords] = 'a_keyword'
      tree.save!

      fragment = tree.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id name explanation clarification tree keywords))
      expect(fragment[:keywords]['en']).to eq(['a_keyword'])
    end

    it "generates manifest fragment with training_sentences" do
      tree[:config][:training_sentences] = ['a training sentence']
      tree[:config][:use_wit_ai] = true
      tree.save!

      fragment = tree.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id name explanation clarification tree training_sentences))
      expect(fragment[:training_sentences]['en']).to eq(['a training sentence'])
    end

    it "generates manifest fragment with no training_sentences when disabled wit_ai" do
      tree[:config][:training_sentences] = ['a training sentence']
      tree[:config][:use_wit_ai] = false
      tree.save!

      fragment = tree.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:training_sentences]).to be_nil
    end

    it "generates manifest fragment with no keywords when enabled wit_ai" do
      tree[:config][:keywords] = 'a_keyword'
      tree[:config][:use_wit_ai] = true
      tree.save!

      fragment = tree.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:keywords]).to be_nil
    end
  end

  describe "survey" do
    let!(:survey) {
      bot.skills.create_skill!('survey', config: {
                                 schedule: '2017-12-15T14:30:00Z',
                                 questions: [
                                   { type: 'select_one',
                                     name: 'opt_in',
                                     choices: 'yes_no',
                                     message: 'Can I ask you a question?' },
                                   { type: 'integer',
                                     name: 'age',
                                     message: 'How old are you?',
                                     constraint: '. <= 150',
                                     constraint_message: 'No way you are that old' }
                                 ],
                                 choice_lists: [
                                   { name: 'yes_no',
                                     choices: [
                                       { name: 'yes', labels: 'yes,yep,sure,ok' },
                                       { name: 'no', labels: 'no,nope,later' }
                                     ]}
                                 ]
                               })
    }

    it "generates manifest fragment with keywords" do
      survey[:config][:keywords] = 'a_keyword'
      survey.save!

      fragment = survey.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id schedule name questions choice_lists keywords))
      expect(fragment[:keywords]['en']).to eq(['a_keyword'])
    end

    it "generates manifest fragment with training_sentences" do
      survey[:config][:training_sentences] = ['a training sentence']
      survey[:config][:use_wit_ai] = true
      survey.save!

      fragment = survey.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id schedule name questions choice_lists training_sentences))
      expect(fragment[:training_sentences]['en']).to eq(['a training sentence'])
    end

    it "generates manifest fragment with no training_sentences when disabled wit_ai" do
      survey[:config][:training_sentences] = ['a training sentence']
      survey[:config][:use_wit_ai] = false
      survey.save!

      fragment = survey.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:training_sentences]).to be_nil
    end

    it "generates manifest fragment with no keywords when enabled wit_ai" do
      survey[:config][:keywords] = 'a_keyword'
      survey[:config][:use_wit_ai] = true
      survey.save!

      fragment = survey.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment[:keywords]).to be_nil
    end

    it "creates valid skill" do
      expect(survey).to be_valid
      expect(survey).to be_enabled
    end

    it "generates manifest fragment" do
      fragment = survey.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id schedule name questions choice_lists))
      expect(fragment[:questions].size).to eq(2)
      expect(fragment[:questions][0]).to match({ type: 'select_one',
                                                 name: 'opt_in',
                                                 choices: 'yes_no',
                                                 message: {
                                                   'en' => 'Can I ask you a question?'
                                                 }})
      expect(fragment[:questions][1]).to match({ type: 'integer',
                                                 name: 'age',
                                                 message: {
                                                   'en' => 'How old are you?'
                                                 },
                                                 constraint: '. <= 150',
                                                 constraint_message: {
                                                   'en' => 'No way you are that old'
                                                 }})
      expect(fragment[:choice_lists].size).to eq(1)
      expect(fragment[:choice_lists][0]).to match({ name: 'yes_no',
                                                    choices: [
                                                      { name: 'yes',
                                                        labels: {
                                                          'en' => ['yes', 'yep', 'sure', 'ok']
                                                        }
                                                      },
                                                      { name: 'no',
                                                        labels: {
                                                          'en' => ['no', 'nope', 'later']
                                                        }
                                                      }
                                                    ]
                                                  })
    end

    it "does not include keywords when not defined" do
      survey.config["keywords"] = ""
      expect(survey.manifest_fragment.keys).to_not include(:keywords)
    end

    it "generates manifest with translations" do
      add_languages 'en', 'es'
      survey.config['keywords'] = 'age'

      survey.translations.create! key: 'keywords', lang: 'es', value: 'edad'
      survey.translations.create! key: 'questions/[name=opt_in]/message', lang: 'es', value: 'Puedo preguntarte algo?'
      survey.translations.create! key: 'questions/[name=age]/message', lang: 'es', value: 'Qué edad tenés?'
      survey.translations.create! key: 'questions/[name=age]/constraint_message', lang: 'es', value: 'No podés tener esa edad'
      survey.translations.create! key: 'choice_lists/[name=yes_no]/choices/[name=yes]/labels', lang: 'es', value: 'si,sep,claro'
      survey.translations.create! key: 'choice_lists/[name=yes_no]/choices/[name=no]/labels', lang: 'es', value: 'no,luego'

      fragment = survey.manifest_fragment
      expect(fragment[:keywords]).to match({ 'en' => ['age'], 'es' => ['edad'] })
      expect(fragment[:questions][0][:message]).to match({ 'en' => 'Can I ask you a question?',
                                                           'es' => 'Puedo preguntarte algo?' })
      expect(fragment[:questions][1][:message]).to match({ 'en' => 'How old are you?',
                                                           'es' => 'Qué edad tenés?' })
      expect(fragment[:questions][1][:constraint_message]).to match({ 'en' => 'No way you are that old',
                                                                      'es' => 'No podés tener esa edad' })
      expect(fragment[:choice_lists][0][:choices][0][:labels]).to match({ 'en' => ['yes', 'yep', 'sure', 'ok'],
                                                                          'es' => ['si', 'sep', 'claro'] })
      expect(fragment[:choice_lists][0][:choices][1][:labels]).to match({ 'en' => ['no', 'nope', 'later'],
                                                                          'es' => ['no', 'luego'] })
    end

    it "returns translation keys for questions and choice lists" do
      survey.config['keywords'] = 'age'
      keys = survey.translation_keys
      expect(keys).to be_an(Array)
      expect(keys.map { |key| key[:key] }).to match_array(['keywords',
                                                           'questions/[name=opt_in]/message',
                                                           'questions/[name=age]/message',
                                                           'questions/[name=age]/constraint_message',
                                                           'choice_lists/[name=yes_no]/choices/[name=yes]/labels',
                                                           'choice_lists/[name=yes_no]/choices/[name=no]/labels'])
      expect(keys.map { |key| key[:default_translation] }).to match_array(['age',
                                                                           'Can I ask you a question?',
                                                                           'How old are you?',
                                                                           'No way you are that old',
                                                                           'yes,yep,sure,ok',
                                                                           'no,nope,later'])
    end
  end

  describe "scheduled_messages" do
    it "creates valid skill" do
      scheduled_messages = bot.skills.create_skill!('scheduled_messages')
      expect(scheduled_messages).to be_valid
      expect(scheduled_messages).to be_enabled
    end

    it "generates manifest fragment" do
      scheduled_messages = bot.skills.create_skill!('scheduled_messages')
      fragment = scheduled_messages.manifest_fragment
      expect(fragment).to_not be_nil
      expect(fragment.keys).to match_array(%i(type id name schedule_type messages))
    end
  end
end
