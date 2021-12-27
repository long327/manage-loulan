<template>
  <div class="app-container">
    <div class="title fl">我的播客</div>
    <div class="filter-container fr">
      <div class="right">
        <!-- <el-input
          size="mini"
          style="width: 200px;margin-right:1em"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="listQuery.keyword">
        </el-input> -->
        <div v-if="permissions.includes('podcast:add')" tips="可以添加">
          <el-button round type="primary" @click="addSpecial"
            >添加专辑</el-button
          >
        </div>
        <div v-if="!permissions.includes('podcast:add')" tips="弹出框">
          <el-button round type="primary" @click="tips">添加专辑</el-button>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="mytable">
      <el-table
        class="mytable"
        :key="tableKey"
        v-loading="listLoading"
        :data="listData"
        :border="false"
        header-cell-class-name="tb-header"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="专辑" align="center" width="230">
          <template slot-scope="scope">
            <div class="fl">
              <el-avatar
                style="margin-left: 20px"
                :size="40"
                :src="scope.row.cover"
                :class="scope.row.unAuthorized ? 'unauth' : ''"
              />
            </div>

            <div class="fl" style="margin-left: 20px">
              <div>
                <a class="table-title" :title="scope.row.title">
                  {{ scope.row.title }}
                </a>
                <i
                  class="el-icon-edit-outline"
                  v-if="scope.row.auditType == 2"
                  @click="editName(scope.$index, scope.row)"
                ></i>
              </div>
              <div class="source">{{ scope.row.source }}</div>
            </div>
            <div class="clear"></div>
          </template>
        </el-table-column>
        <el-table-column label="摘要" align="center">
          <template slot-scope="scope">
            <span
              style="
                text-align: left;
                display: inline-block;
                vertical-align: middle;
              "
              >{{ scope.row.summary }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="单集数" align="center" width="100">
          <template slot-scope="scope">
            <router-link
              class="num"
              :to="{
                path: './channel',
                query: {
                  title: scope.row.title,
                  type: scope.row.type,
                  channelId: scope.row.id,
                },
              }"
              >{{ scope.row.counts }}</router-link
            >
            <!-- <span>{{ scope.row.counts }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.auditType == 2 ">
              <span>已拒绝</span>
              <el-tooltip placement="top">
                <div slot="content">{{ scope.row.auditMessage }}</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
            <div v-else-if="scope.row.auditType == 0 || scope.row.auditType == 4 || scope.row.auditType == 5">
              <span>待审核</span>
            </div>
            <div v-else-if="scope.row.auditType == 1">
              <span>已上线</span>
            </div>
            <div v-else-if="scope.row.auditType == 3">
              <span>已下线</span>
              <el-tooltip placement="top">
                <div slot="content">{{ scope.row.auditMessage }}</div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="200"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.auditType == 0"></div>
            <div v-else-if="scope.row.auditType == 1">
              <el-button
                type="text"
                size="mini"
                class="js-copy"
                data-clipboard-action="copy"
                :data-clipboard-text="file_url"
                @click="handleCopy(scope.$index, scope.row)"
              >
                复制xml地址
              </el-button>
              <el-button type="text"
                @click="apple(scope.row.rss)"
              >
                发布到Apple podcasts
              </el-button>
            </div>
            <div v-else-if="scope.row.auditType == 2">
              <el-button type="text" @click="againReview(scope.row, 5)"
                >提交审核</el-button
              >
            </div>
            <div v-else-if="scope.row.auditType == 3">
              <el-button type="text" @click="againReview(scope.row, 4)"
                >提交审核</el-button
              >
            </div>


          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <el-dialog
      title="专辑信息"
      width="700px"
      :visible.sync="showDialog"
      @close="closeDialog('ruleForm')"
    >
      <el-row>
        <p class="tips">审核通过后，将在Kroraina客户端发布</p>
        <p class="tips">
          您也可以一键发布到Apple Podcasts，或复制xml地址，发布到其他播客平台
        </p>
        <el-col :span="12">
          <el-form
            :model="myPodcastInfo"
            :rules="rules"
            ref="ruleForm"
            class="myPodcastInfo"
          >
            <el-form-item prop="title">
              <el-input
                v-model="myPodcastInfo.title"
                placeholder="标题"
              ></el-input>
            </el-form-item>
            <el-form-item prop="source">
              <el-input
                v-model="myPodcastInfo.source"
                placeholder="来源"
              ></el-input>
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="myPodcastInfo.email"
                placeholder="邮件"
              ></el-input>
            </el-form-item>
            <el-form-item prop="copyright">
              <el-input
                v-model="myPodcastInfo.copyright"
                placeholder="版权"
              ></el-input>
            </el-form-item>

            <el-form-item prop="summary">
              <el-input
                type="textarea"
                v-model="myPodcastInfo.summary"
                placeholder="摘要"
              ></el-input>
            </el-form-item>

            <el-col :span="7">
              <el-form-item prop="lan">
                <el-select
                  v-model="myPodcastInfo.lan"
                  placeholder="语言"
                >
                  <el-option
                    v-for="item in languageOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item prop="type">
                <el-select
                  v-model="myPodcastInfo.type"
                  :disabled="isEditSpecial"
                  placeholder="媒体"
                  @change="chooseMedia"
                >
                  <el-option
                    v-for="(item, index) in mediaOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item prop="category">
                <el-select
                  v-model="myPodcastInfo.category"
                  placeholder="类别"
                >
                  <el-option
                    v-for="item in categorieOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>

          <el-col v-if="typeof myPodcastInfo.type == 'number'">
            <p class="simple-set">上传第一期单集（ 供审核使用 ）</p>
            <el-upload
              class="local-upload"
              ref="uploadMedia"
              :data="uploadParams"
              :action="uploadUrl"
              accept="file"
              :disabled="listLoading"
              :on-remove="handleRemoveAudio"
              :before-remove="beforeRemove"
              :before-upload="beforeAudioUpload"
              :on-error="uploadError"
              :on-progress="uploadProgress"
              :on-success="handleSuccessAudio"
              :with-credentials="true"
              :limit="1"
              :on-exceed="handleExceedVideo"
            >
              <el-button
                type="primary"
                class="primary"
                size="mini"
                :plain="listLoading"
                :disabled="listLoading"
              >
                <i class="el-icon-loading" v-show="listLoading"></i>
                本地上传
              </el-button>
            </el-upload>
            <!-- <template>
              <div v-for="(item, index) in uploadArr" :key="index">
                <div>{{ item.name }}</div>
                <el-progress :percentage="progressBar" :color="progressState">
                </el-progress>
              </div>
            </template> -->
            <div class="result-media" v-if="uploadArr.length > 0">
              <audio
                v-if="myPodcastInfo.type == 0"
                height="36px"
                :src="uploadArr[0].url"
                controls
                controlslist="download"
              ></audio>

              <video
                v-else
                height="136px"
                :src="uploadArr[0].url"
                controls
                controlslist="download"
              ></video>
              <el-input
                v-model="seriesName"
                @input="picEdit(seriesName)"
                placeholder="请输入单集名称"
              ></el-input>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox v-model="agree">我已阅读并同意</el-checkbox>
              <a @click="innerVisible = true" class="serviceAgreement"
                >《播客服务协议》</a
              >
            </div>
          </el-col>
          <el-col v-else>
            <div style="height: 50px"></div>
          </el-col>
        </el-col>

        <el-col :span="11" :offset="1">
          <el-upload
            class="uploadImg"
            accept=".png,.jpg"
            :action="uploadUrl"
            :data="uploadParams"
            multiple
            drag
            :before-upload="handleBeforeUpload"
            :on-preview="handlePicturePreview"
            :on-success="handleSuccess"
            :with-credentials="true"
            :limit="1"
            :file-list="fileList"
            :on-remove="handleRemove"
          >
            <div v-if="myPodcastInfo.cover">
              <el-image
                style="height: 340px"
                :src="myPodcastInfo.cover"
                fit="cover"
              ></el-image>
            </div>
            <div v-else>
              <i class="icon-upload"></i>
              <div class="el-upload__text">
                <p>请将封面拖到此处，或<em>点击上传</em></p>
              </div>
              <div class="el-upload__tip">
                <p>
                  <i class="el-icon-info" />
                  图片尺寸不小于1400*1400像素，
                </p>
                仅支持jpg/png文件，且不超过5M
              </div>
            </div>
          </el-upload>

          <el-row style="right: 38px; position: absolute; bottom: 0px">
            <!-- <el-col :span="9" :offset="3">
              <el-button @click="resetForm('ruleForm')">取消</el-button>
            </el-col> -->
            <el-col :span="9" :offset="10">
              <el-button
                type="primary"
                @click="submitForm('ruleForm')"
                style="background-color: #f98d45;border:1px solid #f98d45;"
                >提交</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-dialog
        width="60%"
        title="楼兰平台播客服务使用协议"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="ServiceAgreement">
          <h1>楼兰平台播客服务使用协议 V1</h1>

          <p>
            欢迎使用楼兰平台（以下简称“楼兰”）的播客服务！楼兰为国广国际在线网络（北京）有限公司（下称“国际在线”）开发的网络平台，为用户提供播客内容托管服务及播客节目展示、订阅、下载服务，用户可以通过勾选相应的内容来选择是否使用楼兰的服务。
          </p>
          <h3>一、重要提示</h3>
          <p class="black">
            请您在使用楼兰服务或申请注册流程时仔细阅读本协议之全部条款，并确认您已完全理解本协议之规定，尤其是涉及您的重大权益及义务的加粗或划线条款。如您对协议有任何疑问，可向平台客服咨询后决定停止使用楼兰服务及注册平台用户。
          </p>
          <h3>二、协议的接受与变更</h3>
          <p>
            请您在使用楼兰服务前充分阅读并且理解本协议，当您开始使用楼兰服务时，将视为您签署了本协议，表明您自愿接受本协议全部条款的约束，本协议将构成您与国际在线及其经营的楼兰平台之间具有约束力的法律文件。
          </p>
          <p>
            考虑到互联网服务不断高速发展和演进，您同意国际在线有权利对本协议进行修改，协议修改后，国际在线将通过在相关页面公布修改的内容、通过您注册时提供的通讯工具发送或者其他任何合理方式通知您，您同意承担及时阅读确认修改协议的义务。如果您不同意协议的修改，请立即停止访问或停止使用本网站或取消已经获得的服务；如果您选择在本协议修改后继续访问或使用本网站，则视为您已接受本协议的修改。
          </p>
          <p>
            您与国际在线签署的本协议所列明的条款，并不能完全涵盖您与国际在线所有的权利和义务。您同意国际在线公布其他声明、规则等均视为本协议之补充协议，为本协议不可分割的组成部分，与本协议具有同等法律效力。
          </p>
          <h3>三、服务的内容与方式</h3>
          <p>
            您同意，国际在线及其关联公司有权根据组织架构、相关资质选择其内部合规的服务主体，为广大用户提供技术服务、推广服务等多方面的服务。
          </p>
          <p>您同意接受楼兰提供的：</p>
          <div class="harmful-wrap">
            <p>
              <i class="dot"></i
              >播客节目托管服务，楼兰可以帮您托管您的播客节目。
            </p>
            <p>
              <i class="dot"></i
              >播客节目推广服务，楼兰可以展示、推广您的博客节目，让用户通过楼兰订阅、下载您的播客节目。
            </p>
          </div>

          <p>
            由于互联网的高速发展，国际在线及其关联公司将在未来向用户提供更多的服务，除非另有明确规定外，未来提供的新服务也适用于本协议。
          </p>
          <p>
            楼兰提供服务的方式主要为：搭建“楼兰官网”、“楼兰”移动客户端，为您上载、传播其内容提供平台；且通过不同的渠道，为用户上载、管理、传播、推广其内容。
          </p>
          <p>
            楼兰不保证其提供的服务一定满足您的全部需求。楼兰保留随时修改、中断或终止无偿提供的服务且无需通知您的权利，且不承担任何责任；若影响您与楼兰进行的有偿交易，您同意楼兰有权在事先通知的情况下予以修改、中断，双方将按照公平公正、诚实信用、等价有偿的原则处理后续事宜。
          </p>

          <h3>四、用户的权利</h3>
          <p>
            ⒈您在注册楼兰播客账号并通过审核后，可以登陆楼兰并通过其平台账号上载音频作品、图片、专辑等；
          </p>
          <p>
            ⒉您有权在注册并登录后在线收听音频作品、按照楼兰的运行规则在“楼兰”移动客户端内下载收听音频作品等；
          </p>
          <p>
            ⒊您有权在注册并登录后，根据平台的规定，订阅专辑、节目并分享声音、专辑等；
          </p>
          <p>
            ⒋您有权在注册并登录后，根据平台的规定，参与平台的各种线上、线下推广活动；
          </p>
          <p>
            ⒌您有权在注册并登录后，根据平台的规定，参与平台的商业性项目，通过平台提供的增值化服务取得经济收益。
          </p>

          <h3>五、用户的义务</h3>
          <p class="black">
            您承诺并保证遵守《中华人民共和国著作权法》、《中华人民共和国商标法》、《中华人民共和国反不正当竞争法》、《中华人民共和国民法典》、《中华人民共和国广告法》、《中华人民共和国计算机信息系统安全保护条例》、《计算机软件保护条例》及《信息网络传播权保护条例》等有关法律、法规、规章的规定。在任何情况下，楼兰合理的认为您有可能违反上述法律、法规、规章的规定，有权不经事先通知您终止自行提供服务。
          </p>
          <p>
            您承诺并保证，您在平台上传的文字、图片、视频、音频、多媒体资料或其他内容拥有相应合法的权利。上述文字、图片、视频、音频、多媒体资料或其他内容，不侵犯任何第三方的肖像权、名誉权、著作权、商标权等权利；不违反您与第三方所签订的对用户有约束力的法律文件的规定；否则，楼兰有权根据用户违反本协议的严重程度对用户采取警示整改、限制功能、暂停更新等处置措施，并及时对发布的信息依法或依据本协议进行删除或屏蔽，并有权不经事先通知终止向该用户提供服务，保存记录并向有关主管部门报告。违反本规定，给他人造成损害的，您依法承担民事责任；构成犯罪的，依法追究其刑事责任；尚不构成犯罪的，由有关主管部门依照有关法律、行政法规的规定予以处罚。
          </p>

          <h4>禁止您从事以下行为：</h4>
          <p>
            a)
            涉及危害国家安全、泄露国家秘密的；侵犯国家社会集体的和公民的合法权益的；制作、复制、发行或传播带有煽动抗拒、破坏法律、法规实施的，煽动颠覆国家政权，推翻社会主义制度的，煽动分裂国家、破坏国家统一的，煽动民族仇恨、民族歧视，破坏民族团结的，捏造或者歪曲事实，散布谣言，扰乱社会秩序的，宣扬、散布淫秽、色情、赌博、暴力、凶杀、恐怖、教唆犯罪的，公然侮辱他人或者捏造事实诽谤他人的，或者进行其他恶意攻击的，损害国家机关信誉、荣誉和利益的，其他违反法律、法规的内容。
          </p>
          <p>
            b）歪曲、丑化、亵渎、否定英雄烈士事迹和精神，以侮辱、诽谤或者其他方式侵害英雄烈士的姓名、肖像、名誉、荣誉的。
          </p>
          <p>c）宣扬恐怖主义、极端主义或者煽动实施恐怖活动、极端主义活动的；</p>
          <p>d) 破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
          <p>
            e)
            冒充任何人或机构，或以虚伪不实的方式谎称或使人误认为与任何人或任何机构有关的。
          </p>
          <p>
            f)
            伪造标题或以其他方式操控识别资料，使人误认为该内容为楼兰所传送的。
          </p>
          <p>
            g)
            将有关干扰、破坏或限制任何计算机软件、硬件或通讯设备功能的软件病毒或其他计算机代码、档案和程序之资料，加以上载、张贴、发送电子邮件或以其他方式传送。
          </p>
          <p>
            h)
            以技术方式攻击或破坏或改变平台的部分或全部、或干扰其运行；以非法方式获取或使用平台的任何软件、代码或其他技术或商业信息；禁止您对平台运行的任何程序进行反向工程、反向编译、反向汇编或改写。
          </p>
          <p>
            i)
            未经许可使用平台的网站名称、公司名称、商标、商业标识、网页版式或内容、或其他由楼兰或国际在线享有知识产权或权利的信息或资料；将平台以任何形式作为从事各种非法活动的场所、平台或媒介。未经国际在线的书面授权或许可，您不得以楼兰或者国际在线的名义从事任何商业活动，也不得以任何形式将平台作为从事商业活动的场所、平台或媒介。
          </p>
          <p>
            j)
            未经国际在线书面许可、另行签署协议或另行指定可供您使用的特定商业服务外，您不得以商业目的使用平台；不得对平台的任何部分或全部进行商业性质利用、复制、拷贝、出售、调查、广告。
          </p>
          <p>
            k)
            未经国际在线书面许可、另行签署协议或另行指定可供您使用的特定商业服务外，您不得通过平台发布有关任意第三方的广告宣传内容。
          </p>
          <p>
            您就其所上传的内容承担全部法律责任。因您违反法律规定或本协议规定造成违约或侵犯第三方合法权益的，由您自行解决。如果给国际在线或楼兰平台造成损失，国际在线有权向您追偿其因此所遭受的全部损失、包括其直接损失、间接损失、预期利益损失等损失。
          </p>

          <h4>禁止您利用楼兰平台服务，从事以下行为：</h4>
          <p>
            a）利用网络和相关信息技术实施侮辱、诽谤、威胁、散布谣言以及侵犯他人隐私等违法行为，损害他人合法权益。
          </p>
          <p>
            b）通过发布、删除信息以及其他干预信息呈现的手段侵害他人合法权益或者谋取非法利益。
          </p>
          <p>
            c）利用深度学习、虚拟现实等新技术新应用从事法律、行政法规禁止的活动。
          </p>
          <p>
            d）通过人工方式或者技术手段实施流量造假、流量劫持以及虚假注册账号、非法交易账号、操纵用户账号等行为，破坏网络生态秩序。
          </p>
          <p>
            f）利用党旗、党徽、国旗、国徽、国歌等代表党和国家形象的标识及内容，或者借国家重大活动、重大纪念日和国家机关及其工作人员名义等，违法违规开展网络商业营销活动。
          </p>

          <h4>鼓励您从事以下行为：</h4>
          <p>
            a)
            宣传习近平新时代中国特色社会主义思想，全面准确生动解读中国特色社会主义道路、理论、制度、文化的；
          </p>
          <p>b) 宣传党的理论路线方针政策和中央重大决策部署的；</p>
          <p>c) 展示经济社会发展亮点，反映人民群众伟大奋斗和火热生活的；</p>
          <p>
            d)
            弘扬社会主义核心价值观，宣传优秀道德文化和时代精神，充分展现中华民族昂扬向上精神风貌的；
          </p>
          <p>
            e) 有效回应社会关切，解疑释惑，析事明理，有助于引导群众形成共识的；
          </p>
          <p>
            f) 有助于提高中华文化国际影响力，向世界展现真实立体全面的中国的；
          </p>
          <p>g) 其他讲品味讲格调讲责任、讴歌真善美、促进团结稳定等的内容。</p>

          <h3>六、用户产生的内容</h3>
          <p>
            您在平台以各种形式发布的一切信息，均应符合国家法律法规等相关规定及网站相关规定，符合社会公序良俗，并不侵犯任何第三方主体的合法权益。楼兰有权随时检查您所上传的内容，如果发现您上传的内容不符合前述规定，楼兰有权删除或重新编辑您所上传的内容。
          </p>
          <p>
            楼兰有权对您上传的内容进行检查、编辑与修改。但是对于通过平台而传播的内容，楼兰不保证其合法性、正当性、准确性或完整性。在任何情况下，楼兰均不对任何内容承担任何责任，包括但不限于由于任何内容而导致直接或间接损失。用户应自行承担因此产生的一切法律后果，且楼兰及国际在线因此受到的损失，有权向用户追偿。
          </p>
          <p>楼兰有权防范和抵制您制作、复制、发布含有下列内容的不良信息：</p>
          <div class="harmful-wrap">
            <p>a) 使用夸张标题，内容与标题严重不符的；</p>
            <p>b) 炒作绯闻、丑闻、劣迹等的；</p>
            <p>c) 不当评述自然灾害、重大事故等灾难的；</p>
            <p>d) 带有性暗示、性挑逗等易使人产生性联想的；</p>
            <p>e) 展现血腥、惊悚、残忍等致人身心不适的；</p>
            <p>f) 煽动人群歧视、地域歧视等的；</p>
            <p>g) 宣扬低俗、庸俗、媚俗内容的；</p>
            <p>
              h)
              可能引发未成年人模仿不安全行为和违反社会公德行为、诱导未成年人不良嗜好等的；
            </p>
            <p>i) 其他对网络生态造成不良影响的内容。</p>
          </div>
          <p>
            平台将尽可能保存您上传的合法内容，但不承诺将为您保存以上性质的内容，您应自行就前述内容备份。
          </p>

          <h3>七、用户信息保护</h3>
          <p>
            楼兰对保护您个人信息高度重视，楼兰将会采取合理的措施保护您的个人信息。除法律法规规定的情形外，未经您许可楼兰不会向第三方公开、透露您个人信息。楼兰对相关信息采用专业加密存储与传输方式，保障您个人信息的安全，并将运用各种安全技术和程序建立完善的管理制度来保护您的个人信息，以免遭受未经授权的访问、使用或披露。
          </p>
          <p class="black">
            您注册并获得平台提供的服务时，须提供必要的个人信息。如：为向您提供账号注册服务或进行用户身份识别，需要您填写邮箱等信息；为向您提供更换头像/
            更换专辑封面/
            发布动态可选择拍照方式，需要调用摄像头的权限；为向您提供录音，并将录音作品上传的服务，需要调用录音的权限；为向您提供在播放过程中，如有电话呼入，需要切换播放状态，将正在播放的内容暂停的服务，需要获取电话状态的权限；为向您提供同步播放列表及内容的服务，需要读取您的设备账号，获得系统账号，用于和其他移动设备（例如智能手表）同步播放列表及内容的权限；为向您提供通过手机通讯录匹配功能推荐好友等服务，需要获得访问您手机通讯录的权限等。若国家法律法规或政策有特殊规定的，您需要提供真实的身份信息。若您提供的信息不完整，则无法使用本服务或在使用过程中受到限制。
          </p>
          <p>
            楼兰承诺，未经您同意，不会以非法方式披露您个人信息。但是下列情形除外：依照法律或司法、行政机关的强制性命令对第三方披露您个人信息且无需事先向您发出通知；当您通过平台购买商品或服务时，您的信息将被提供给前述商品或服务的销售者，您应自行承担此类信息披露的责任。
          </p>
          <p>
            下述情况下，<span class="black"
              >您授权楼兰及国际在线利用您的个人信息：</span
            >
          </p>
          <div class="harmful-wrap">
            <p class="black">a) 在紧急情况下，为维护用户及公众的权益。</p>
            <p class="black">
              b)
              为维护楼兰及国际在线的著作权、商标权、专利权及其他任何合法权利或权益。
            </p>
            <p class="black">
              c)
              在进行促销或抽奖时，平台可能会与赞助商共享用户的个人信息，在这些情况下平台会在发送用户信息之前进行提示，并且用户可以通过明确表示不参与活动而终止传送。
            </p>
            <p class="black">
              d) 为获取第三方数据而将用户信息与第三方数据匹配。
            </p>
            <p class="black">
              e)
              将用户数据用于统计，以便向未来的合作伙伴、广告商及其他第三方以及为了其他合法目的而描述平台的服务。
            </p>
          </div>

          <p class="black">
            一般情况下，您可随时浏览、修改自己提交的信息，但出于安全性和身份识别（如号码申诉服务）的考虑，您可能无法修改注册时提供的初始注册信息及其他验证信息。
          </p>
          <p>
            楼兰亦非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用平台的服务前，应事先取得您的家长或法定监护人的同意。
          </p>
          <p>其他事宜请您确认个人信息保护政策中的相关条款。</p>

          <h3>八、知识产权归属与授权</h3>
          <p>
            国际在线对楼兰服务及本网站所使用的软件所包含的的资料受知识产权法或其他法律保护，本网站的内容版权归国际在线所有。本网站所有设计图样以及其他图样、产品及服务名称，均为国际在线所享有，任何人不得使用、复制或用作其他用途。您对本网站所使用的软件有非专属性使用权，但不得自行或许可任何第三方复制、修改、出售或衍生产品。
          </p>
          <p>
            您经由本平台传送的文字、图片、音频、视频及其他内容，受到著作权法、商标法、专利法或其他法律的保护；您对该文字、图片、音频、视频及其他内容享有著作权，未经国际在线书面授权许可，第三方不得进行修改、出租、售卖或衍生其他作品。
          </p>
          <p>
            国际在线对其专有内容、原创内容和其他通过授权取得的独占或者独家内容享有知识产权。未经国际在线书面许可，任何单位和个人不得私自转载、传播和提供收听服务或者有其他侵犯国际在线知识产权的行为。否则，将承担法律责任。
          </p>
          <p>
            除非国际在线收到相反证据，国际在线将视您为其在平台上载或发布的内容的版权所有人。
            <span class="black"
              >您点击同意本协议，即表明您主动将您在任何时间段在本网站发表的任何形式的内容的著作财产权无偿授权给楼兰及其关联公司使用，楼兰及其关联公司有权通过楼兰网站(
              www.kroraina.com.cn )
              、“Kroraina”移动客户端对前述内容进行复制、下载、编辑、修改、展示及网络传播。同时您许可楼兰及其关联公司有权利就任何主体侵权而单独提起诉讼，并获得赔偿。</span
            >
            本协议已经构成《著作权法》第二十五条所规定的书面协议，其效力及于用户在平台发布的任何受著作权法保护的内容，无论该内容形成于本协议签订前还是本协议签订后。
          </p>

          <h3>九、免责说明</h3>
          <p>
            楼兰作为网络服务提供者，不担保网站平台上的信息及服务能充分满足您的需求。您在接受平台服务的过程中，可能遇到错误、侮辱、诽谤、不作为、淫秽、色情或亵渎事件，楼兰不承担法律责任。
          </p>
          <p>
            基于互联网的特殊性，平台也不担保服务不会中断，对服务的及时性、安全性不作担保，不承担非因平台导致的责任。楼兰力图使用户能对本网站进行安全访问和使用，但楼兰不保证本平台或服务器是不含病毒或其它潜在有害因素的；因此用户应使用业界公认的软件查杀任何自平台下载文件中的病毒。
          </p>
          <p>
            除非以书面形式明确约定，楼兰对于用户以任何方式（包括但不限于包含、经由、连接或下载）从本网站所获得的任何内容信息，包括但不限于音频内容、广告内容、其他用户信息、商户信息、用户评价内容等，不保证其准确性、完整性、可靠性；对于用户因本网站上的内容信息而购买、获取的任何产品、服务、信息或资料，楼兰及国际在线不承担责任。
          </p>
          <p>
            平台内所有用户所上传的声音、专辑等内容，仅代表用户个人观点，并不表示本网站赞同其观点或证实其描述，本网站不承担用户上传的内容引发的任何法律责任。楼兰有权删除平台内各类不符合法律或协议规定的内容，而保留不通知用户的权利。
          </p>
          <p>
            所有发给您的通告，平台都将通过正式的页面公告或站内信或电子邮件或客服电话或手机短信或常规的信件送达。任何非经平台正规渠道获得的活动或信息，楼兰平台、国际在线及其关联公司不承担法律责任。
          </p>

          <h3>十、第三方服务</h3>
          <p>
            楼兰可能会提供第三方国际互联网网站或资源链接，除非另有声明外，楼兰无法对第三方网站服务进行控制，因此由于下载、传播、使用或依赖上述网站或资源所产生的损失或损害，楼兰及国际在线不承担任何责任。
          </p>
          <p>
            对于在楼兰托管的播客内容，楼兰的播客专辑管理页面可能会提供给用户将播客节目发布到第三方平台上的按钮，楼兰无法控制第三方平台的链接和服务，对于已经通过楼兰托管服务上传到第三方播客平台的内容，楼兰亦无法控制该内容在第三方平台上的修改、删除等操作。
          </p>

          <h3>十一、侵权投诉</h3>
          <p>
            根据《中华人民共和国民法典》的规定，任何第三方认为用户利用楼兰侵害其民事权益或实施侵权行为的，被侵权人有权书面通知楼兰采取删除、屏蔽、断开链接等必要措施。
          </p>
          <p>
            根据《信息网络传播权保护条例》的规定，
            <span class="black"
              >任何第三方认为，平台所涉及的作品、表演、录音录像制品，侵犯自己的合法权益的，可以向平台提交书面通知，要求平台删除该侵权作品，或者断开链接。通知书应当包含下列内容：权利人的姓名（名称）、联系方式和地址；要求删除或者断开链接的侵权作品、表演、录音录像制品的名称和网络地址；权利人的有效权利证明材料。权利人应当对通知书的真实性负责，如果侵权投诉不实，则需承担相应的法律责任。</span
            >
          </p>
          <p>
            侵权投诉必须包含下述信息：被侵权人的有效权利证明材料，或被侵权作品的原始链接及其它证明材料；侵权信息或作品在平台上的具体名称及链接；侵权投诉人的联络方式，以便平台及时与您取得联系，包括电子邮件地址、电话号码或手机等；投诉内容须纳入以下声明：“本人本着诚信原则，有证据认为该对象侵害本人的合法权益。本人承诺全部投诉信息真实、准确，自愿承担一切后果。”；本人亲笔签字并注明日期，如代理他人投诉的，必须出具授权人签字的授权书。
          </p>

          <h3>十二、平台的商业活动</h3>
          <p>
            <span class="black"
              >您理解并接受，国际在线及其关联公司为楼兰平台的运营，可以进行下述商业活动：</span
            >
            通过电子邮件、客户端、网页或其他合法方式向用户发送推广信息或其他相关商业信息。通过增值服务系统或其他方式向用户发送相关服务信息或其他信息，其他信息包括但不限于通知信息、宣传信息、广告信息等。
          </p>
          <p>
            您理解并接受，国际在线为了平台的运营可在平台及相关服务中展示国际在线、关联公司或第三方的商业、非商业信息（在楼兰的任何位置，包括不限于在播放页贴片、播放页皮肤等位置发布前述信息）。
          </p>

          <h3>十三、服务的终止</h3>
          <p>
            您理解并同意，楼兰基于经营策略的调整，可能会对服务内容进行变更，也可能会中断、中止或终止服务。
          </p>
          <p>
            您理解并同意，如您在使用楼兰服务时存在违反法律法规、本协议及其他楼兰规则、社会公德、公序良俗和/或侵害他人合法权益等情形，楼兰有权不经通知而单方中断或终止向您提供全部或部分服务。
          </p>
          <p>
            您理解并同意，如您实施违反法律法规、社会公德、公序良俗和/或侵害他人合法权益等行为，并因此影响或可能影响楼兰和/或他人的名誉、声誉或其他合法权益，楼兰有权不经通知而单方中断或终止向您提供全部或部分服务。
          </p>
          <p>
            楼兰终止向您提供服务后，有权根据适用法律的要求删除您的个人信息，或使其匿名化处理，亦有权依照法律规定的期限和方式继续保存您留存于我方平台的其他内容和信息。
          </p>

          <h3>十四、法律适用、管辖和其他</h3>
          <p>
            如您对楼兰播客服务协议有任何疑问、意见或建议，您可通过以下方式与我们取得联系，我们将在15个工作日内回复您的请求：
          </p>
          <p>联系邮箱：【service@kroraina.com.cn】</p>
          <p>本协议签订地为中华人民共和国北京市石景山区。</p>
          <p>
            本协议的生效、履行、解释及争议的解决均适用中华人民共和国法律。您因使用楼兰平台而产生或与之相关的一切争议。权利主张或其他事项，均适用中华人民共和国法律。
          </p>
          <p>
            您与国际在线及其经营的楼兰平台发生的一切争议，应友好协商，如协商不成的，应将争议<span
              class="black"
              >提交至协议签订地人民法院诉讼管辖。</span
            >
          </p>
          <p class="black">
            楼兰平台可能不时发布针对用户的相关协议，并可能将该相关协议作为对本协议的补充或修改而将其内容作为本协议的一部分。请您及时关注并阅读相关协议。
          </p>
          <p>
            本协议任意一条被视为废止、无效或不可执行，该条款应视为可被拆分的且不影响本协议其他条款的法律效力。
          </p>

          <p>
            【审慎提醒】
            <span class="black">
              如您使用楼兰平台或进行用户注册的，将视为您已同意前述服务协议，该等条款将立即生效，并构成您和国际在线及其经营的楼兰平台之间有约束力的法律文件。
            </span>
          </p>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import SocialSign from './components/SocialSignin'
import { handleAuthResult } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import PodcastImg from "./components/podcastImg";
import { validUsername } from "@/utils/validate";
import Rename from "@/mixins/RenameHandler";
import {
  getPodcast,
  setPodcast,
  deletePodcast,
  addChannel,
  queryChannel,
  updatePodcast,
  channelApply,
  getSingle
} from "@/api/podcast";

export default {
  name: "mypodcast",
  components: { Pagination, PodcastImg },
  mixins: [Rename],
  data() {
    const myPodcastInfoRules = {
      title: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      source: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      summary: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      email: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!validUsername(value)) {
              callback(new Error("请输入正确的email"));
            } else {
              callback();
            }
          },
        },
      ],
      copyright: [
        {
          required: true,
          trigger: "change",
          validator: (rule, value, callback) => {
            if (!value || value.length < 1) {
              callback(new Error("不能为空！"));
            } else {
              callback();
            }
          },
        },
      ],
      lan: [{ required: true, message: "请选择语言", trigger: "change" }],
      type: [{ required: true, message: "请选择媒体类型", trigger: "change" }],
      category: [{ required: true, message: "请选择类别", trigger: "change" }],
    };
    return {
      uploadUrl: `${process.env.VUE_APP_BASE_API}/resource/upload`,
      tableKey: 0,
      currentPage: "",
      listLoadingText: true,
      list: null,
      articleList: null,
      total: 0,
      tableKey: 0,
      showDialog: false,
      listLoading: false,
      listQuery: {
        page: 1,
        size: 20,
        searchAuditType: 4,
        queryType: 0
      },
      pushCounts: {},
      listData: [],
      myPodcastInfo: {
        title: "",
        source: "",
        summary: "",
        lan: "",
        author: "",
        type: "",
        category: "",
        email: "",
        copyright: "",
        cover: "",
        size: 20,
        page: 1,
        //v1.4
        auditType: '',
        auditMessage: "",
        exampleUrl: "",
        exampleTitle: "",
        channelItem: {
          duration: 0,
          size: 0,
        },
      },
      fileList: [],
      languageOptions: [],
      categorieOptions: [],
      mediaOptions: [
        {
          label: "音频",
          value: 0,
        },
        {
          label: "视频",
          value: 1,
        },
      ],
      formInline: {
        user: "",
        region: "",
      },
      rules: myPodcastInfoRules,
      file_url: "",
      isEdit: -1,
      takeTitle: "",
      isEditSpecial: false,
      uploadParams: {
        duration: 0,
        width: 0,
        height: 0,
        size: 0,
      },
      innerVisible: false,
      seriesName: "",
      agree: false,
      progressBar: 0,
      progressState: "#67c23a",
      uploadArr: [],
      refuseObj: {
        id: "",
        auditType: 0,
        auditMessage: "",
      },
    };
  },
  created() {},
  mounted() {
    this.getList();
  },
  computed: {
    ...mapGetters(["oauthUsers", "permissions"]),
    filteredOauthUsers() {
      if (this.listQuery.keyword) {
        return this.oauthUsers.filter(
          (u) => u.nick && u.nick.indexOf(this.listQuery.keyword) > -1
        );
      }
      if (this.listQuery.type) {
        return this.oauthUsers.filter(
          (u) => u.oauthType === this.listQuery.type.toUpperCase()
        );
      } else {
        return this.oauthUsers;
      }
    },
  },
  methods: {
    apple(url) {
      window.open('https://podcastsconnect.apple.com/my-podcasts/new-feed?submitfeed=' + url)
    },
    againReview(item, type) {

      this.refuseObj.id = item.id;
      this.refuseObj.auditType = type;
      channelApply(this.refuseObj)
        .then((res) => {
          this.$message({
            message: "成功！",
            type: "success",
          });
          this.getList();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //暂时
    tips() {
      this.$alert(
        "目前暂不支持自行创建新专辑，如有需要请发邮件至service@kroraina.com.cn",
        "提示",
        {}
      )
        .then(() => {})
        .catch(() => {});
    },
    chooseMedia() {
      let mediaType = [0, 1];
      if (
        mediaType.indexOf(this.myPodcastInfo.type) != -1 &&
        this.uploadArr.length > 0
      ) {
        this.handleRemoveAudio();
      }
    },
    addSpecial() {
      this.showDialog = true;
      this.$nextTick(() => {
        getPodcast()
          .then((res) => {
            this.languageOptions = res.data.languages;
            this.categorieOptions = res.data.categories;
          })
          .catch((err) => {});
      });
    },
    handleCopy(index, row) {
      let _this = this;
      _this.file_url = row.rss;
      let clipboard = new this.clipboard(".js-copy");
      clipboard.on("success", function () {
        _this.$message({
          message: "复制成功！",
          type: "success",
        });
        clipboard.destroy();
      });
      clipboard.on("error", function () {
        _this.$message({
          message: "复制失败 ",
          type: "error",
        });
      });
    },
    getList() {
      queryChannel(this.listQuery)
        .then((res) => {
          this.listData = res.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleFilter(type) {
      this.listQuery.type = type;
    },
    handleRemove(file, fileList) {
      this.myPodcastInfo.cover = "";
      this.fileList = [];
    },
    handlePicturePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file) {
      this.myPodcastInfo.cover = res.data[0].url;
    },
    handleBeforeUpload(file) {
      let _this = this;
      const is5M = file.size / 1024 / 1024 <= 5; // 限制
      const isSize = new Promise(function (resolve, reject) {
        let width = 1400; // 限制图片尺寸为1400
        let height = 1400;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function () {
          console.log(img.width, img.height);
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸不小于1400 x 1400");
          return Promise.reject();
        }
      );

      if (!is5M) {
        _this.$message.error("图片大小不可超过5MB");
        return false;
      }
      return isSize;
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields();
      this.myPodcastInfo.cover = "";
      if (this.isEdit = -1) {
        this.isEditSpecial = false;
      }
      else {
        this.isEditSpecial = true;
      }

      this.fileList = [];
      this.uploadArr = [];
      this.seriesName = "";
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.myPodcastInfo.cover == "") {
            this.$message.warning("请上传封面图片！");
            return false;
          }
          if (this.uploadArr.length < 1) {
            let media = this.myPodcastInfo.type == 0 ? '音频' : '视频'
            this.$message.warning("请上传"+ media +"！");
            return false;
          }
          if (this.seriesName.replace(/(^\s*)|(\s*$)/g, "") == '') {
            this.$message.warning("单集名称不能为空.");
            return false;
          }
          if (!this.agree) {
            this.$message.warning("请勾选《播客服务协议》");
            return false;
          }
          this.myPodcastInfo.exampleTitle = this.seriesName;
          if (this.isEdit != -1) {
            updatePodcast(this.myPodcastInfo)
              .then((response) => {
                this.$message.success("成功");
                this.showDialog = false;
                this.getList();
              })
              .catch((msg) => {
                this.$message.error("失败");
              });
          } else {
            addChannel(this.myPodcastInfo)
              .then((res) => {
                this.showDialog = false;
                this.getList();

                this.$store
                  .dispatch("oauth/resetUsers")
                  .then((res) => {})
                  .catch((err) => {});
              })
              .catch((err) => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.myPodcastInfo.cover = "";
      this.fileList = [];
      this.showDialog = false;
      this.isEdit = -1;
    },
    handleDelete(row) {
      this.$confirm("确定要删除该专辑吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deletePodcast({ id: row.id })
            .then((res) => {
              this.$message.success("删除成功！");
              this.getList();

              this.$store
                .dispatch("oauth/resetUsers")
                .then((res) => {})
                .catch((err) => {});
            })
            .catch((err) => {
              this.$message.error(err.msg);
            });
        })
        .catch(() => {});
    },
    confirmEdit(row) {
      if (row.title == "") {
        this.$message.warning("不能为空");
        return;
      }
      this.saveEdit(row);
    },
    picEdit(name) {},
    editName(idx, rowInfo) {
      // this.takeTitle = title;
      this.isEdit = idx;
      this.showDialog = true;
      this.isEditSpecial = true;
      this.$nextTick(() => {
        this.myPodcastInfo.title = rowInfo.title;
        this.myPodcastInfo.source = rowInfo.source;
        this.myPodcastInfo.summary = rowInfo.summary;
        this.myPodcastInfo.email = rowInfo.email;
        this.myPodcastInfo.copyright = rowInfo.copyright;
        this.myPodcastInfo.category = rowInfo.category;
        this.myPodcastInfo.cover = rowInfo.cover;
        this.myPodcastInfo.lan = rowInfo.lan;
        this.myPodcastInfo.type = rowInfo.type;

        getPodcast()
          .then((res) => {
            this.languageOptions = res.data.languages;
            this.categorieOptions = res.data.categories;
          })
          .catch((err) => {});

        this.uploadArr.push({ url: rowInfo.exampleUrl });
        this.seriesName = rowInfo.exampleTitle;
        this.exampleUrl = rowInfo.exampleUrl;

        if (rowInfo.auditType == 5) {
          this.myPodcastInfo.auditType = 2
        }
        else {
          this.myPodcastInfo.auditType = 2
        }

        getSingle({id: rowInfo.id}).then( res=> {
          let data = res.data;
          this.myPodcastInfo = Object.assign(this.myPodcastInfo, {
            id: rowInfo.id,
            exampleUrl: rowInfo.exampleUrl,
            auditMessage: "",
            channelItem: {
              duration: data.channelItem.duration,
              size: data.channelItem.size
            },
          });
        }).catch(err => {
          console.log(err);
        })

      });
    },
    uploadProgress(ev, file, fileList) {
      this.progressBar = Math.floor(ev.percent);
    },
    //音频上传之前
    beforeAudioUpload(file) {
      // 限制上传文件大小 300M
      const isLt300M = file.size / 1024 / 1024 <= 300;
      if (this.myPodcastInfo.type == 0) {
        // 文件类型进行判断
        const isAudio = file.type === "audio/mp3" || file.type === "audio/mpeg";

        // const isTime60S = this.audioDuration >= 60 ? true : "";

        if (!isAudio) {
          this.$message.error("上传文件只能是Mp3格式!");
          return false;
        } else {
          if (!isLt300M) {
            this.$message.error("上传文件大小不能超过 300MB!");
            return false;
          }
        }
      } else {
        if (
          ["video/mp4", "video/mov", "video/quicktime"].indexOf(file.type) == -1
        ) {
          this.listLoading = false;
          this.$message.error("请上传正确的视频格式");
          return false;
        }
        if (!isLt300M) {
          this.$message.error("上传视频大小不能超过300MB哦!");
          this.listLoading = false;
          return false;
        }
      }

      this.listLoading = true;
      this.show = true;
      return isLt300M;
    },
    //上传
    handleSuccessAudio(res, file) {
      this.listLoading = false;
      this.progressState = "success";
      let mediaInfo = res.data[0].obj;

      let name = mediaInfo.title;
      let dot = name.lastIndexOf(".");
      this.mediaType = name.substr(dot, name.length - 1);
      let splitName = name.substr(0, dot);
      // this.seriesName = splitName;

      this.myPodcastInfo.exampleUrl = mediaInfo.url;
      this.myPodcastInfo.channelItem.duration = mediaInfo.duration;
      this.myPodcastInfo.channelItem.size = mediaInfo.size;
      this.uploadArr.push(mediaInfo);
    },
    handleExceedVideo(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    uploadError() {
      this.listLoading = false;
      this.progressState = "#f56c6c";
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
      this.listLoading = false;
    },
    handleRemoveAudio(file, fileList) {
      this.uploadArr = [];
      this.seriesName = "";
      this.$refs["uploadMedia"].clearFiles();
    },
  },
  created() {
    var self = this;
    window.handleAuthResult = function (id) {
      handleAuthResult(id, self);
    };
  },
  filters: {
    transState(value) {
      return !value ? "已授权" : "未授权";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
@import "./index.scss";
.el-tooltip__popper {
  width: 300px;
}

.ServiceAgreement {
  & {
    padding: 20px;
    margin: 0 auto;
    height:700px;
    overflow:auto;
  }
  h1 {
    text-align: center;
  }
  h3 {
    line-height: 1.5em;
  }
  h4 {
    text-indent: 2em;
  }
  p {
    color: #777;
    line-height: 1.5em;
    text-indent: 1em;
    padding-left: 2em;
  }
  .harmful-wrap {
    padding-left: 1em;
  }
  .dot{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #000;
    margin-right: .5em;
  }
  .black {
    color: #000;
    font-weight: 800;
  }
}
</style>

