require 'sinatra'
require 'sinatra/reloader' if development?
require 'securerandom'
require 'fileutils'
require 'json'
require 'dotenv/load'

ALLOWED_EXTENSIONS = [".mp4", ".mp3"]

set :public_folder, File.dirname(__FILE__) + '/public'
set :upload_dir, 'public/tmp'
set :work_dir, 'tmp'
set :max_size_mb, 100

before do
  FileUtils.mkdir_p(settings.upload_dir) rescue Errno::EEXIST
  FileUtils.mkdir_p(settings.work_dir) rescue Errno::EEXIST
end

helpers do
  def valid_time_format?(str)
    !!(str =~ /^\d{2}:\d{2}:\d{2}$/)
  end
end

get '/' do
  erb :index
end

get '/done/:uuid' do
  @uuid = params[:uuid]
  erb :done
end

post '/cut' do
    filename = params[:video][:filename]
  ext = File.extname(filename).downcase
  unless ALLOWED_EXTENSIONS.include?(ext)
    @error = "対応しているファイル形式は .mp4 と .mp3 のみです。"
    return erb :index
  end

  uuid = SecureRandom.uuid
  upload_path = File.join(settings.upload_dir, "#{uuid}#{ext}")

  File.open(upload_path, 'wb') do |f|
    f.write(params[:video][:tempfile].read)
  end

  start_time = params[:start_time]
  end_time = params[:end_time]

  # 出力ファイル名
  output_ext = ext  # mp4ならmp4、mp3ならmp3で出力
  output_filename = "#{uuid}#{output_ext}"
  output_path = File.join(settings.public_folder, 'tmp', output_filename)

  # ffmpegで切り抜き処理
  command = "ffmpeg -i #{upload_path.shellescape} -ss #{start_time} -to #{end_time} -c copy #{output_path.shellescape}"
  system(command)

  redirect "/done/#{uuid}"
end

  unless params[:video] && params[:start_time] && params[:end_time]
    @error = "動画と切り抜き時間を指定してください。"
    return erb :index
  end

  unless valid_time_format?(params[:start_time]) && valid_time_format?(params[:end_time])
    @error = "時間形式は 00:00:10 のように「時:分:秒」で入力してください。"
    return erb :index
  end

  if params[:video][:tempfile].size > settings.max_size_mb * 1024 * 1024
    @error = "動画ファイルが大きすぎます（#{settings.max_size_mb}MBまで対応）"
    return erb :index
  end

  uuid = SecureRandom.uuid
  input_path = File.join(settings.work_dir, "input_#{uuid}.mp4")
  temp_cut_path = File.join(settings.work_dir, "cut_#{uuid}.mp4")
  output_path = File.join(settings.upload_dir, "#{uuid}.mp4")

  FileUtils.copy(params[:video][:tempfile].path, input_path)

  # === 無音検出（silencedetect）===
  silence_log_path = File.join(settings.work_dir, "silence_#{uuid}.txt")
  silence_cmd = "ffmpeg -i \"#{input_path}\" -af silencedetect=noise=-30dB:d=0.5 -f null - 2> \"#{silence_log_path}\""
  puts "無音検出コマンド: #{silence_cmd}"
  system(silence_cmd)

  silences = []
  current_start = nil
  if File.exist?(silence_log_path)
    File.readlines(silence_log_path).each do |line|
      if line.include?("silence_start:")
        current_start = line[/silence_start:\s*([\d.]+)/, 1].to_f
      elsif line.include?("silence_end:")
        silence_end = line[/silence_end:\s*([\d.]+)/, 1].to_f
        silences << { start: current_start, end: silence_end } if current_start
        current_start = nil
      end
    end
  end

  json_dir = File.join(settings.public_folder, "json")
  FileUtils.mkdir_p(json_dir)
  json_path = File.join(json_dir, "#{uuid}.json")
  File.write(json_path, JSON.pretty_generate(silences))
  puts "無音区間を保存: #{json_path}"

  # === 切り抜きと逆再生 ===
  start = params[:start_time]
  finish = params[:end_time]
  reverse = params[:reverse] == "on"

  # ステップ1：切り抜き（先にtemp_cut_pathに）
  cut_command = "ffmpeg -y -i \"#{input_path}\" -ss #{start} -to #{finish} -c copy \"#{temp_cut_path}\""
  puts "切り抜きコマンド: #{cut_command}"
  cut_success = system(cut_command)

  unless cut_success && File.exist?(temp_cut_path)
    File.delete(input_path) if File.exist?(input_path)
    @error = "動画の切り抜きに失敗しました。"
    return erb :index
  end

  # ステップ2：逆再生（チェックありの場合）
  if reverse
    reverse_command = "ffmpeg -y -i \"#{temp_cut_path}\" -vf reverse -af areverse \"#{output_path}\""
    puts "逆再生コマンド: #{reverse_command}"
    reverse_success = system(reverse_command)

    unless reverse_success && File.exist?(output_path)
      File.delete(temp_cut_path) if File.exist?(temp_cut_path)
      @error = "逆再生に失敗しました。"
      return erb :index
    end

    File.delete(temp_cut_path) if File.exist?(temp_cut_path)
  else
    FileUtils.mv(temp_cut_path, output_path)
  end

  File.delete(input_path) if File.exist?(input_path)
  redirect "/done/#{uuid}"
end
