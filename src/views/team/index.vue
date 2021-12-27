<template>
  <div class="leeTeam">
    <div class="account">
      <div class="accountSlider">
        <span class="ASHeader subtitle-text">设置中心</span>
        <div class="active">成员管理</div>
      </div>
      <div class="AccountRightCont">
        <div class="AccountTeamModule">
          <div class="AccountTeamModule_Header">
            <div class="team_name">成员管理</div>
            <div class="team_right">
              <div class="team_td team_margin">
                <el-select @change="changeItem" v-model="axiosData.teamId" placeholder="全部团队">
                  <el-option
                    v-for="item in leeSelectItems"
                    :key="item.teamId"
                    :label="item.teamName"
                    :value="item.teamId"
                  ></el-option>
                </el-select>
              </div>
              <div class="team_status team_margin">
                <el-select
                  v-model="axiosData.invitationStatus"
                  @change="selectStatus"
                  placeholder="全部状态"
                >
                  <el-option
                    v-for="item in leeSelectStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="team_input team_margin">
                <el-input v-model="axiosData.nickname" placeholder="成员姓名. 邮箱"></el-input>
                <el-button slot="append" icon="el-icon-search" @click="searchItemAll"></el-button>
              </div>
              <div class="team_search">
                <el-button type="primary" v-if="isAdmin" @click="addUser">+邀请成员</el-button>
              </div>
            </div>
          </div>
          <div class="AccountTeamModule_main">
            <el-table :header-cell-style="getRowClass" :data="leeTeamData" style="width: 100%">
              <el-table-column label="成员" width="240">
                <template slot-scope="scope">
                  <div class="leeTableUser">
                    <span class="left">{{ scope.row.userOne }}</span>
                    <div class="right">
                      <h3>{{ scope.row.nickname}}</h3>
                      <p>{{ scope.row.email }}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="邀请状态">
                <template slot-scope="scope">
                  <span
                    class="leeTableStatus1"
                    v-if="scope.row.invitationState=='WAIT'&&!scope.row.isChangjianzhe"
                  >待确认</span>
                  <span
                    class="leeTableStatus2"
                    v-if="scope.row.invitationState=='IN'&&!scope.row.isChangjianzhe"
                  >已加入</span>
                  <span
                    class="leeTableStatus3"
                    v-if="scope.row.invitationState=='OUT'&&!scope.row.isChangjianzhe"
                  >已拒绝</span>
                </template>
              </el-table-column>
              <el-table-column label="团队">
                <template slot-scope="scope">
                  <span class="lee-tearm">{{ scope.row.teamName }}</span>
                  <i
                    v-if="scope.row.isChangjianzhe&&isAdmin"
                    style="cursor: pointer;"
                    class="el-icon-edit"
                    @click="alertModifyTearm"
                  ></i>
                </template>
              </el-table-column>
              <el-table-column label="角色">
                <template slot-scope="scope">
                  <span>{{ scope.row.memberRoleName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="权限">
                <template slot-scope="scope">
                  <span>{{ scope.row.jurisdiction}}</span>
                </template>
              </el-table-column>
              <el-table-column label="管理的社交号" prop="number"></el-table-column>
              <el-table-column label="启用/停用" v-if="isAdmin">
                <template
                  slot-scope="scope"
                  v-if="!scope.row.isChangjianzhe&&scope.row.invitationState=='IN'"
                >
                  <el-switch
                    v-model="scope.row.status"
                    @change="changeSwitch(scope.row.allOauthUsersId,scope.row.status,scope.row.id,scope.row.userId,)"
                    active-color="#7e7ef4"
                    inactive-color="#f2f2fe"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="isAdmin" width="180">
                <template slot-scope="scope" v-if="!scope.row.isChangjianzhe">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      操作
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="scope.row.invitationState!='OUT'">
                        <span @click="modifyLeeShare(scope.row)">分配社交号</span>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.invitationState!='OUT'">
                        <span @click="modifyLeeConfig(scope.row)">配置权限</span>
                      </el-dropdown-item>
                      <el-dropdown-item v-if="scope.row.invitationState=='OUT'">
                        <span @click="leeInvitation(scope.row)">再次邀请</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="!scope.row.status && scope.row.invitationState!=='WAIT'"
                      >
                        <span
                          @click="leeDelete(scope.row.allOauthUsersId,scope.row.id,scope.row.teamName,scope.row.email,scope.row.userId)"
                        >删除成员</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="scope.row.status || scope.row.invitationState=='WAIT'"
                      >
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="已开启状态成员无法删除"
                          placement="top-start"
                        >
                          <span class="shanchu">删除成员</span>
                        </el-tooltip>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--翻页-->
          <pagination
            style="padding:10px"
            v-show="total > 0"
            :total="total"
            :page.sync="axiosData.pageIndex"
            :limit.sync="axiosData.pageSize"
            :layout="'total, prev, pager, next, slot'"
            @pagination="getList"
          >
            <template v-slot:input>
              <div class="input-wrap-currentPage">
                <span>前往</span>
                <el-input class="slot-input-currentPage" v-model.number="currentPage"></el-input>
                <span>页</span>
              </div>
            </template>
            <template v-slot:jumpPage>
              <div class="jumpPage-wrap">
                <el-button class="jumpPage" @click="jumpPage">跳转</el-button>
              </div>
            </template>
          </pagination>
          <!--翻页-->
        </div>
      </div>
    </div>
    <el-dialog title="邀请成员" :visible.sync="emailVisible" width="440px">
      <div class="leeMail">
        <div class="leeMailTop">
          <span>邮箱</span>
          <el-input type="email" @focus="focusEmail" v-model="leeMail" placeholder="请输入邮箱地址"></el-input>
        </div>
        <p class="leeMailBottom">
          <span v-if="isSfZc">{{emailVisibleError}}</span>
        </p>
      </div>
      <div class="leeMail-footer">
        <el-button type="primary" @click="nextEmail">下一步</el-button>
      </div>
    </el-dialog>
    <!--yaoqing-->
    <el-dialog title="邀请成员" :visible.sync="addshareBle" width="640px">
      <div class="jurisd">
        <div class="jurisd_header">
          <span>{{leeMailOne}}</span>
          <em>{{leeMail}}</em>
        </div>
        <div class="leeUserqh">
          <div :class="{active:isActive}" @click="qiehuan(true)">分配社交号</div>
          <div :class="{active:!isActive}" @click="qiehuan(false)">权限</div>
        </div>
        <!--社交号0-->
        <div class="shejiao" v-if="isActive">
          <div class="jurisd_Bom">
            <p class="assign_page_Tip">从您的社交号列表中选择社交号，分配给此成员管理</p>
          </div>
          <div class="assign-page-wrap">
            <div class="selects-account-con">
              <div class="selects-account-Choice">
                <!--left-->
                <div class="select-account">
                  <div class="select-title">您的社交号列表（{{LeeShare.length}}）</div>
                  <div class="select-box">
                    <div class="PageListMainTitlePlatform">
                      <div v-if="shareActive==-1" class="PageListMainTitleAcitveall">
                        <span @click="leeCheckSelect(-1)">All</span>
                      </div>
                      <div
                        v-if="shareActive!=-1"
                        class="PageListMainTitleAcitveall PageListMainTitleAcitveall2"
                      >
                        <span @click="leeCheckSelect(-1)">All</span>
                      </div>
                      <div @click="leeCheckSelect(0)">
                        <img v-if="shareActive==0" src="@/assets/images-lee/Facebook_0.png" />
                        <img v-if="shareActive!=0" src="@/assets/images-lee/Facebook_1.png" />
                      </div>
                      <div @click="leeCheckSelect(1)">
                        <img v-if="shareActive==1" src="@/assets/images-lee/Twitter_0.png" />
                        <img v-if="shareActive!=1" src="@/assets/images-lee/Twitter_1.png" />
                      </div>

                      <!-- 暂时 -->
                      <div @click="leeCheckSelect(2)" class="isYoutube-authorized">
                        <img v-if="shareActive==2" src="@/assets/images-lee/YouTube_0.png" />
                        <img v-if="shareActive!=2" src="@/assets/images-lee/YouTube_1.png" />
                      </div>

                      <div @click="leeCheckSelect(3)" style="margin-right:0">
                        <img v-if="shareActive==3" src="@/assets/images-lee/PODCAST_0.png" />
                        <img v-if="shareActive!=3" src="@/assets/images-lee/PODCAST_1.png" />
                      </div>
                    </div>
                    <!--2-->
                    <div class="select_account">
                      <div class="search_input_wrap">
                        <el-input v-model="searchShareList.nickname" placeholder="搜索社交号"></el-input>
                        <el-button slot="append" @click="searchShare" icon="el-icon-search"></el-button>
                      </div>
                      <ul class="UserPagesUl">
                        <li class="UserPagesUlliActive" v-for="item in LeeShare" :key="item.id">
                          <el-checkbox v-model="item.checked" @change="checkOne(item)">
                            <div>
                              <div class="account-item">
                                <img class="userImg" :src="item.avatar" />
                                <div class="user-info-text">
                                  <p class="userName">
                                    <img
                                      v-if="item.source=='FACEBOOK'"
                                      src="@/assets/images-lee/Facebook_tou.png"
                                    />
                                    <img
                                      v-if="item.source=='TWITTER'"
                                      src="@/assets/images-lee/twitter.png"
                                    />
                                    <img
                                      v-if="item.source=='GOOGLE'"
                                      src="@/assets/images-lee/YouTube.png"
                                    />
                                    <img
                                      v-if="item.source=='PODCAST'"
                                      src="@/assets/images-lee/podcast.png"
                                    />
                                    <span class="page-name-text">{{item.username}}</span>
                                  </p>
                                  <p class="pageName">
                                    <span class="page-name-text">{{item.email}}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </el-checkbox>
                        </li>
                      </ul>
                      <div class="select_all_wrap">
                        <el-checkbox v-model="allSelected" @change="leeAllSelected">全选</el-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                <!--right-->
                <div
                  class="select-account"
                  style="width: 284px;margin-left:20px;margin-right:22px;padding:0"
                >
                  <div class="select-title">
                    <span>已选社交号（{{LeeSubime.length}}）</span>
                    <span @click="clearAll">全部清除</span>
                  </div>
                  <div class="select-box" style="overflow:auto">
                    <div class="account-item-list">
                      <div class="account-item-wrap">
                        <div
                          class="account-list-item"
                          v-for="(shareChild,index) in LeeSubime"
                          :key="shareChild.id"
                        >
                          <div class="account-item">
                            <img class="userImg" :src="shareChild.avatar" />
                            <div class="user-info-text">
                              <p class="userName">
                                <img
                                  v-if="shareChild.source=='FACEBOOK'"
                                  src="@/assets/images-lee/Facebook_tou.png"
                                />
                                <img
                                  v-if="shareChild.source=='TWITTER'"
                                  src="@/assets/images-lee/twitter.png"
                                />
                                <img
                                  v-if="shareChild.source=='GOOGLE'"
                                  src="@/assets/images-lee/YouTube.png"
                                />
                                <img
                                  v-if="shareChild.source=='PODCAST'"
                                  src="@/assets/images-lee/podcast.png"
                                />
                                <span class="page-name-text">{{shareChild.username}}</span>
                              </p>
                              <p class="pageName">
                                <span class="page-name-text">{{shareChild.email}}</span>
                              </p>
                            </div>
                          </div>
                          <div class="close-item">
                            <i
                              class="iconfont el-icon-close"
                              @click="clearOne(shareChild.id,index)"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--社交号0-->
        <!--权限0-->
        <div class="quanxian" v-if="!isActive">
          <div class="jurisd_Bom">
            <p>为成员配置权限</p>
            <div class="bottom">
              <div class="newdiv" v-for="item in jurisdicData" :key="item.id">
                <div class="left">
                  <el-radio
                    v-model="newradio"
                    @change="changeRadio(item)"
                    :label="item.id"
                  >{{item.name}}</el-radio>
                </div>
                <span>{{item.text}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--权限0-->
      </div>
      <div class="leeMail-footer">
        <el-button type="primary" plain round @click="pre">上一步</el-button>
        <el-button type="primary" round @click="yaoqing">邀请</el-button>
      </div>
    </el-dialog>
    <!--yaoqing-->
    <!--分配社交号1-->
    <el-dialog title="分配社交号" :visible.sync="shareBle" width="640px">
      <div class="jurisd">
        <div class="jurisd_header">
          <span>{{leeMailOne}}</span>
          <em>{{leeMail}}</em>
        </div>
        <div class="jurisd_Bom">
          <p class="assign_page_Tip">从您的社交号列表中选择社交号，分配给此成员管理</p>
        </div>
        <div class="assign-page-wrap">
          <div class="selects-account-con">
            <div class="selects-account-Choice">
              <!--left-->
              <div class="select-account">
                <div class="select-title">您的社交号列表（{{LeeShare.length}}）</div>
                <div class="select-box">
                  <div class="PageListMainTitlePlatform">
                    <div v-if="shareActive==-1" class="PageListMainTitleAcitveall">
                      <span @click="leeCheckSelect(-1)">All</span>
                    </div>
                    <div
                      v-if="shareActive!=-1"
                      class="PageListMainTitleAcitveall PageListMainTitleAcitveall2"
                    >
                      <span @click="leeCheckSelect(-1)">All</span>
                    </div>
                    <div @click="leeCheckSelect(0)">
                      <img v-if="shareActive==0" src="@/assets/images-lee/Facebook_0.png" />
                      <img v-if="shareActive!=0" src="@/assets/images-lee/Facebook_1.png" />
                    </div>
                    <div @click="leeCheckSelect(1)">
                      <img v-if="shareActive==1" src="@/assets/images-lee/Twitter_0.png" />
                      <img v-if="shareActive!=1" src="@/assets/images-lee/Twitter_1.png" />
                    </div>

                    <!-- 暂时 -->
                    <div @click="leeCheckSelect(2)" class="isYoutube-authorized">
                      <img v-if="shareActive==2" src="@/assets/images-lee/YouTube_0.png" />
                      <img v-if="shareActive!=2" src="@/assets/images-lee/YouTube_1.png" />
                    </div>

                    <div @click="leeCheckSelect(3)" style="margin-right:0">
                      <img v-if="shareActive==3" src="@/assets/images-lee/PODCAST_0.png" />
                      <img v-if="shareActive!=3" src="@/assets/images-lee/PODCAST_1.png" />
                    </div>
                  </div>
                  <!--2-->
                  <div class="select_account">
                    <div class="search_input_wrap">
                      <div class="search_input_wrap">
                        <el-input v-model="searchShareList.nickname" placeholder="搜索社交号"></el-input>
                        <el-button slot="append" @click="searchShare" icon="el-icon-search"></el-button>
                      </div>
                    </div>
                    <ul class="UserPagesUl">
                      <li class="UserPagesUlliActive" v-for="item in LeeShare" :key="item.id">
                        <el-checkbox v-model="item.checked" @change="checkOne(item)">
                          <div>
                            <div class="account-item">
                              <img class="userImg" :src="item.avatar" />
                              <div class="user-info-text">
                                <p class="userName">
                                  <img
                                    v-if="item.source=='FACEBOOK'"
                                    src="@/assets/images-lee/Facebook_tou.png"
                                  />
                                  <img
                                    v-if="item.source=='TWITTER'"
                                    src="@/assets/images-lee/twitter.png"
                                  />
                                  <img
                                    v-if="item.source=='GOOGLE'"
                                    src="@/assets/images-lee/YouTube.png"
                                  />
                                  <img
                                    v-if="item.source=='PODCAST'"
                                    src="@/assets/images-lee/podcast.png"
                                  />
                                  <span class="page-name-text">{{item.username}}</span>
                                </p>
                                <p class="pageName">
                                  <span class="page-name-text">{{item.email}}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </el-checkbox>
                      </li>
                    </ul>
                    <div class="select_all_wrap">
                      <el-checkbox v-model="allSelected" @change="leeAllSelected">全选</el-checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <!--right-->
              <div
                class="select-account"
                style="width: 284px;margin-left:20px;margin-right:22px;padding:0"
              >
                <div class="select-title">
                  <span>已选社交号（{{LeeSubime.length}}）</span>
                  <span @click="clearAll">全部清除</span>
                </div>
                <div class="select-box" style="overflow:auto">
                  <div class="account-item-list">
                    <div class="account-item-wrap">
                      <div
                        class="account-list-item"
                        v-for="(shareChild,index) in LeeSubime"
                        :key="shareChild.id"
                      >
                        <div class="account-item">
                          <img class="userImg" :src="shareChild.avatar" />
                          <div class="user-info-text">
                            <p class="userName">
                              <img
                                v-if="shareChild.source=='FACEBOOK'"
                                src="@/assets/images-lee/Facebook_tou.png"
                              />
                              <img
                                v-if="shareChild.source=='TWITTER'"
                                src="@/assets/images-lee/twitter.png"
                              />
                              <img
                                v-if="shareChild.source=='GOOGLE'"
                                src="@/assets/images-lee/YouTube.png"
                              />
                              <img
                                v-if="shareChild.source=='PODCAST'"
                                src="@/assets/images-lee/podcast.png"
                              />
                              <span class="page-name-text">{{shareChild.username}}</span>
                            </p>
                            <p class="pageName">
                              <span class="page-name-text">{{shareChild.email}}</span>
                            </p>
                          </div>
                        </div>
                        <div class="close-item">
                          <i class="iconfont el-icon-close" @click="clearOne(shareChild.id,index)"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="leeMail-footer">
        <el-button type="primary" round @click="commitShare">完成</el-button>
      </div>
    </el-dialog>
    <!-- 配置权限-->
    <el-dialog title="配置权限" :visible.sync="jurisdicBle" width="420px">
      <div class="jurisd">
        <div class="jurisd_header">
          <span>{{leeMailOne}}</span>
          <em>{{leeMail}}</em>
        </div>
        <div class="jurisd_Bom">
          <p>为成员配置权限</p>
          <div class="bottom">
            <div class="newdiv" v-for="item in jurisdicData" :key="item.id">
              <div class="left">
                <el-radio
                  v-model="newradio"
                  @change="changeRadio(item)"
                  :label="item.id"
                >{{item.name}}</el-radio>
              </div>
              <span>{{item.text}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="leeMail-footer">
        <el-button round @click="jurisdicBle = false">取 消</el-button>
        <el-button round type="primary" @click="permissionSure">保 存</el-button>
      </div>
    </el-dialog>
    <!--删除成员-->
    <el-dialog title="删除成员" :visible.sync="deteleUserBle" width="420px">
      <div class="deleteUserzz">
        <div class="top">确定要删除协作成员{{DeleteEmail}}？</div>
        <div class="bottom">删除后无法恢复，由该协作成员授权的社交号将会被解除授权</div>
      </div>
      <div class="leeMail-footer">
        <el-button @click="deteleUserBle = false">取 消</el-button>
        <el-button type="primary" @click="leeDeleteSure">确定</el-button>
      </div>
    </el-dialog>
    <!--修改队名-->
    <el-dialog title="修改队名" :visible.sync="modifyTeamBle" width="420px">
      <div class="deleteUserzz">
        <el-input v-model="modifyTeamName" placeholder="请输入新的团队名称"></el-input>
      </div>
      <div class="leeMail-footer">
        <el-button @click="modifyTeamBle = false">取 消</el-button>
        <el-button type="primary" @click="modifyTeamBleSure">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import {
  isExist,
  getListByUserId,
  itemGetList,
  getMemberRole,
  getMyoauthUserList,
  updateMemberStatus,
  updateTeam,
  deleteMember,
  getOauthUserListByMemberId,
  updateMemberRole,
  updateMemberOathUser,
  againInvitation,
  addMeber,
  isOffOauthUserBinding
} from "@/api/team";
export default {
  name: "item",
  components: { Pagination },
  computed: {
    ...mapGetters(["sidebar", "id"]),
    //勾选的个数
    selectedCount() {
      return this.LeeShare.reduce((pre, cur) => pre + (cur.checked ? 1 : 0), 0);
    },
    //全选与反选
    allSelected: {
      get() {
        return (
          this.selectedCount == this.LeeShare.length && this.LeeShare.length > 0
        );
      },
      set(isCheck) {
        this.LeeShare.forEach(t => {
          t.checked = isCheck;
        });
      }
    },
    leeMailOne: function() {
      return this.leeMail.charAt(0);
    }
  },

  data() {
    return {
      emailVisibleError: "", //邮箱错误提示
      isAdmin: false,
      emailVisible: false, //邮箱弹出框
      isSfZc: false, //邮箱是否注册
      addshareBle: false, //邀请社交账户/配置权限
      isActive: true, //切换
      shareBle: false, //修改分配社交账户
      shareBleId: 0, //修改配置权限id
      shareBleUserId: 0, //修改配置权限userid
      shareActive: -1,
      jurisdicBle: false, //修改配置权限
      isOne: true, //是否为第一次
      jurisdicData: [], //配置权限数据
      modifyLeeConfigID: 0, //
      permissionId: 0, //修改配置权限id
      perms: [], //必传
      deteleUserBle: false, //删除用户
      DeleteID: "",
      DeleteteamName: "",
      DeleteEmail: "",
      modifyTeamBle: false, //修改团队名称
      modifyTeamName: "", //新的团队名
      //邀请需要数据
      leeMail: "", //邮箱地址
      yquserId: "", //被邀请的用户id
      yqnickname: "", //被邀请的用户nickname
      yqstatus: 0, //默认开启
      createUserId: "", //邀请者id
      newradio: "", //角色外memberRoleId
      members: {}, //权限
      membersArryId: [], //内权限id
      //邀请需要数据 end
      //社交列表
      searchShareList: {
        nickname: "",
        source: "",
        userId: "5f64651259ed01122a2697e0"
      },
      leeTeamData: [],
      leeSelectItems: [],
      leeItemValue: 0,
      leeSelectStatus: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "IN",
          label: "已加入"
        },
        {
          value: "WAIT",
          label: "待确认"
        },
        {
          value: "OUT",
          label: "已拒绝"
        }
      ],
      currentPage: "",
      total: 0,
      axiosData: {
        invitationStatus: "",
        loginUserId: "",
        nickname: "",
        pageIndex: 1,
        pageSize: 10,
        teamId: ""
      },
      LeeSubime: [], //已选社交好
      LeeShare: [] //社交号列表
    };
  },
  methods: {
    getRowClass({ row, rowIndex }) {
      return "background: #f2f2fe;color:#7e7ef4;";
    },
    userCldOne() {
      return this.leeMail.charAt(0);
    },
    handleCommand(command) {
      this.$message("click on item " + command);
    },
    //list 选择团队
    changeItem(val) {
      const newDate = Object.assign({}, this.axiosData, {
        teamId: val,
        pageIndex: 1
      });
      this.axiosData = Object.assign({}, this.axiosData, newDate);
      this.getList();
    },
    //list 选择状态
    selectStatus(val) {
      const newDate = Object.assign({}, this.axiosData, {
        invitationStatus: val,
        pageIndex: 1
      });
      this.axiosData = Object.assign({}, this.axiosData, newDate);
      this.getList();
    },
    //list 查询用户
    searchItemAll() {
      const newDate = Object.assign({}, this.axiosData, {
        pageIndex: 1
      });
      this.axiosData = Object.assign({}, this.axiosData, newDate);
      this.getList();
    },
    //list 启用停用
    changeSwitch(allOauthUsersId, val, id,userId) {
      console.log(userId);

      const eventIndex = this.leeTeamData.findIndex(
        arrItem => arrItem.id === id
      );

      //this.LeeSubime.splice(eventIndex, 1);

      let isGoon = false; //默认可以往下走
      if (!val) {
        let that = this;
        isOffOauthUserBinding({ oauthUserId: allOauthUsersId,userId:userId}).then(function(
          resLee
        ) {
          isGoon = resLee.data;
          if (isGoon) {
            that.$message({
              message:
                "审核流程中存在待处理贴文，请相关联用户完成贴文审核后再停用社交号！",
              type: "error"
            });
            const newData = Object.assign({}, that.leeTeamData[eventIndex], {
              status: true
            });
            that.$set(that.leeTeamData, eventIndex, newData);
            return false;
          } else {
            updateMemberStatus({
              memberId: id,
              statusConstant: val
            })
              .then(function(res) {
                if (val) {
                  that.$message({
                    message: "已启用",
                    type: "success"
                  });
                } else {
                  that.$message({
                    message: "已停用",
                    type: "success"
                  });
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        });
      } else {
        var _this = this;
        updateMemberStatus({
          memberId: id,
          statusConstant: val
        })
          .then(function(res) {
            if (val) {
              _this.$message({
                message: "已启用",
                type: "success"
              });
            } else {
              _this.$message({
                message: "已停用",
                type: "success"
              });
            }

            console.log(res);
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    //list 修改队名
    alertModifyTearm() {
      this.modifyTeamBle = true;
    },
    //list 确定修改队名
    modifyTeamBleSure() {
      if (this.modifyTeamName == "") {
        this.modifyTeamBle = false;
      } else {
        let _this = this;
        updateTeam({
          teamName: this.modifyTeamName,
          id: this.axiosData.teamId
        })
          .then(function(res) {
            _this.$message({
              message: "修改成功",
              type: "success"
            });
            _this.modifyTeamBle = false;
            _this.getList();
            _this.getItems();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      //接口
    },
    //list 删除成员
    leeDelete(allOauthUsersId, id, teamName, email,userId) {
      let isGoon = false; //默认可以往下走
      let that = this;
      isOffOauthUserBinding({ oauthUserId: allOauthUsersId,userId:userId }).then(function(
        resLee
      ) {
        isGoon = resLee.data;
        if (isGoon) {
          that.$message({
            message:
              "审核流程中存在待处理贴文，请相关联用户完成贴文审核后再删除社交号！",
            type: "error"
          });
          return false;
        } else {
          that.deteleUserBle = true;
          that.DeleteID = id;
          that.DeleteteamName = teamName;
          that.DeleteEmail = email;
        }
      });
    },
    //list 提交删除用户
    leeDeleteSure() {
      let _this = this;
      deleteMember({
        memberId: this.DeleteID,
        teamName: this.DeleteteamName
      })
        .then(function(res) {
          _this.$message({
            message: "删除成功",
            type: "success"
          });
          _this.getList();
          _this.deteleUserBle = false;
        })
        .catch(function(error) {
          console.log(error);
        });
    }, //list 修改配置权限
    modifyLeeConfig(item) {
      this.jurisdicBle = true;
      this.isOne = false;
      this.perms = item.perms;
      this.modifyLeeConfigID = item.id;
      this.leeMail = item.email;
      this.permissionId = item.memberRoleId; //选中的id
      this.getMemberRole();
    },
    //list 提交修改权限
    permissionSure() {
      this.members.perms = this.perms;
      const newData = {
        id: this.modifyLeeConfigID, //每条数据id
        memberRole: this.members, //权限
        allPermsId: this.membersArryId, //内权限id
        memberRoleId: this.newradio //角色外memberRoleId
      };
      var _this = this;
      updateMemberRole(newData)
        .then(function(res) {
          _this.$message({
            message: "配置权限成功",
            type: "success"
          });
          _this.jurisdicBle = false;
          _this.getList();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //list 修改社交账号
    modifyLeeShare(item) {
      this.shareBleId = item.id;
      this.shareBleUserId = item.userId;
      this.shareBle = true;
      this.leeMail = item.email;
      var _this = this;
      getOauthUserListByMemberId({
        memberId: this.shareBleId,
        teamId: this.axiosData.teamId
      })
        .then(function(res) {
          (_this.LeeSubime = []), (_this.LeeSubime = res.data.data);
          _this.leeCheckSelect(-1);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //list 修改社交账号 提交
    commitShare() {
      let allOauthUsersId = [];
      this.LeeSubime.forEach(item => {
        allOauthUsersId.push(item.id);
      });
      this.shareBle = false;
      var _this = this;
      updateMemberOathUser({
        id: this.shareBleId,
        userId: this.shareBleUserId,
        allOauthUsersId
      })
        .then(function(res) {
          _this.getList();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //list再次邀请
    leeInvitation(item) {
      var _this = this;
      againInvitation(item)
        .then(function(res) {
          _this.getList();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //邀请用户
    addUser() {
      this.emailVisible = true;
    },
    //下一步
    nextEmail() {
      if (this.leeMail !== "") {
        let _this = this;
        this.isOne = true;
        let newEmailData = {};
        if (this.isAdmin) {
          newEmailData = {
            teamId: this.axiosData.teamId,
            email: this.leeMail
          };
        } else {
          newEmailData = {
            email: this.leeMail
          };
        }
        isExist(newEmailData)
          .then(function(res) {
            if (res.data.succ) {
              _this.yquserId = res.data.data.id; //被邀请的用户id
              _this.yqnickname = res.data.data.nick; //被邀请的用户nickname
              _this.emailVisible = false;
              _this.addshareBle = true;
              _this.isActive = true;
              const newData = Object.assign({}, _this.searchShareList, {
                source: ""
              });
              _this.searchShareList = Object.assign(
                {},
                _this.searchShareList,
                newData
              );
              _this.LeeSubime = [];
              _this.getShareList(); //获取社交账号
              _this.getMemberRole(); //获取权限
            } else {
              _this.isSfZc = true;
              _this.emailVisibleError = res.data.oper;
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        this.$message({
          message: "邮箱不能为空",
          type: "error"
        });
      }
    },
    //邮箱
    focusEmail() {
      this.isSfZc = false;
    },
    //切换
    qiehuan(isbloon) {
      this.isActive = isbloon;
    },
    //权限选择
    changeRadio(item) {
      this.perms = item.members.perms;
      this.newradio = item.id; //默认第一个
      this.members = item;
      this.membersArryId = []; //内权限id
      this.membersArryId = item.membersArryId;
    },
    //上一步
    pre() {
      this.emailVisible = true;
      this.addshareBle = false;
    },
    //提交 邀请用户
    yaoqing() {
      let allOauthUsersId = [];
      this.LeeSubime.forEach(item => {
        allOauthUsersId.push(item.id);
      });
      const newData = {
        createName: this.$store.getters.nick, //创建者昵称
        allOauthUsersId, //社交数组
        createUserId: this.createUserId, //创建者id
        email: this.leeMail, //邮箱
        nickname: this.yqnickname, //被邀请的用户nickname
        status: this.yqstatus, //默认开启
        userId: this.yquserId, //邀请者的用户id
        invitationStatus: "WAIT", //写死WAIT
        memberRole: this.members, //权限
        allPermsId: this.membersArryId, //内权限id
        memberRoleId: this.newradio //角色外memberRoleId
      };
      var _this = this;
      // if (!newData.allOauthUsersId.length) {
      //   _this.$message({
      //     message: "请选取社交账号",
      //     type: "error"
      //   });
      // }
      addMeber(newData)
        .then(function(res) {
          _this.addshareBle = false;
          if (res.data.succ) {
            _this.$message({
              message: "邀请成功",
              type: "success"
            });
          }

          const newData = Object.assign({}, _this.axiosData, {
            invitationStatus: "",
            nickname: "",
            pageIndex: 1,
            pageSize: 10
          });
          _this.axiosData = Object.assign({}, _this.axiosData, newData);
          _this.getItems();
          _this.LeeSubime = [];
          _this.leeMail = "";
          _this.isSfZc = false;
          _this.emailVisibleError = "";
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //社交号分配
    leeCheckSelect(share) {
      if (share == -1) {
        this.shareActive = -1;
        //all
        const newData = Object.assign({}, this.searchShareList, {
          source: ""
        });
        this.searchShareList = Object.assign({}, this.searchShareList, newData);
        this.getShareList();
      } else if (share == 0) {
        this.shareActive = 0;
        //FACEBOOK
        const newData = Object.assign({}, this.searchShareList, {
          source: "FACEBOOK"
        });
        this.searchShareList = Object.assign({}, this.searchShareList, newData);
        this.getShareList();
      } else if (share == 1) {
        this.shareActive = 1;
        //TWITTER
        const newData = Object.assign({}, this.searchShareList, {
          source: "TWITTER"
        });
        this.searchShareList = Object.assign({}, this.searchShareList, newData);
        this.getShareList();
      } else if (share == 2) {
        this.shareActive = 2;
        //YOUTUBE
        const newData = Object.assign({}, this.searchShareList, {
          // source: "YOUTUBE"
          source: "GOOGLE"
        });
        this.searchShareList = Object.assign({}, this.searchShareList, newData);
        this.getShareList();
      } else if (share == 3) {
        this.shareActive = 3;
        //PODCAST
        const newData = Object.assign({}, this.searchShareList, {
          source: "PODCAST"
        });
        this.searchShareList = Object.assign({}, this.searchShareList, newData);
        this.getShareList();
      }
    },
    //搜索社交账号
    searchShare() {
      //all
      const newData = Object.assign({}, this.searchShareList, {
        nickname: this.searchShareList.nickname
      });
      this.searchShareList = Object.assign({}, this.searchShareList, newData);
      this.getShareList();
    },
    //选择
    checkOne(checkItem) {
      let isIn = this.IsContain(this.LeeSubime, checkItem);
      if (!isIn) {
        //不存在
        this.LeeSubime.push(checkItem);
      } else {
        //存在
        console.log("存在");
        const eventIndex = this.LeeSubime.findIndex(
          arrItem => arrItem.id === checkItem.id
        );
        this.LeeSubime.splice(eventIndex, 1);
      }
      console.log(this.LeeSubime);
    },
    //左判断是否在右边 没有责添加
    IsContain(arr, value) {
      let isObtn = false;
      arr.forEach(item => {
        if (item.id == value.id) {
          isObtn = true;
        }
      });
      return isObtn;
    },
    // 全选
    leeAllSelected(status) {
      if (status) {
        this.LeeShare.forEach(leeSub => {
          const Index = this.LeeSubime.findIndex(item => item.id === leeSub.id);
          if (Index > -1) {
          } else {
            this.LeeSubime.push(leeSub);
          }
        });
      } else {
        this.LeeShare.forEach(leeSub => {
          const Index = this.LeeSubime.findIndex(item => item.id === leeSub.id);
          if (Index > -1) {
            this.LeeSubime.splice(Index, 1);
          }
        });
      }
    },
    //右侧全部清除
    clearAll() {
      this.LeeSubime = [];
      this.LeeShare.forEach(leeSub => {
        leeSub.checked = false;
      });
    },
    //右侧删除一个
    clearOne(id, index) {
      this.LeeSubime.splice(index, 1);
      const eventIndex = this.LeeShare.findIndex(arrItem => arrItem.id === id);
      const newDate = Object.assign({}, this.LeeShare[eventIndex], {
        checked: false
      });
      this.$set(this.LeeShare, eventIndex, newDate);
    },
    //解决初始化是否选中
    LeeShareHandle() {
      this.LeeSubime.forEach(leeSub => {
        leeSub.checked = false;
        const Index = this.LeeShare.findIndex(item => item.id === leeSub.id);
        if (Index > -1) {
          const newDate = Object.assign({}, this.LeeShare[Index], {
            checked: true
          });
          this.$set(this.LeeShare, Index, newDate);
        }
      });
    },
    //跳转
    jumpPage() {
      if (this.currentPage != "" && typeof this.currentPage == "number") {
        const newDate = Object.assign({}, this.axiosData, {
          pageIndex: this.currentPage
        });
        this.axiosData = Object.assign({}, this.axiosData, newDate);
        this.getList();
        scrollTo(0, 800);
        this.currentPage = "";
      }
    },
    //获取社交账号
    getShareList() {
      let _this = this;
      getMyoauthUserList(this.searchShareList)
        .then(function(res) {
          _this.LeeShare = [];
          const resPonseData = res.data.data;
          _this.LeeShare = [...resPonseData];
          _this.LeeShareHandle();
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //获取权限账号
    getMemberRole(permissionId) {
      let _this = this;
      getMemberRole()
        .then(function(res) {
          const newDate = res.data.data;
          _this.dataMemberRole(newDate);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //获取数据
    getList() {
      let _this = this;
      itemGetList(this.axiosData)
        .then(function(response) {
          const newDate = response.data.list;
          _this.dataHandle(newDate);
          _this.total = response.data.total;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    //选择团队
    getItems() {
      let _this = this;
      getListByUserId(this.createUserId)
        .then(function(response) {
          const axiosDate = response.data.data;
          _this.leeSelectItems = response.data.data;
          const newDate = Object.assign({}, _this.axiosData, {
            teamId: axiosDate[0].teamId
          });
          _this.axiosData = Object.assign({}, _this.axiosData, newDate);
          _this.getList();
        })

        .catch(function(error) {
          console.log(error);
        });
    },
    //权限数据处理
    dataMemberRole(newDate) {
      this.jurisdicData = [];
      newDate.forEach(element => {
        let text = "";
        let membersArryId = [];
        element.members.forEach(item => {
          text += item.permissionsName + " | ";
          membersArryId.push(item.id);
        });
        text = text.substr(0, text.length - 2);
        this.jurisdicData.push({
          name: element.name, //用户名首字母
          id: element.id, //id
          members: element, //数组
          membersArryId,
          text, //权限
          status: 0, //状态
          source: element.source
        });
      });
      if (this.isOne) {
        //新建
        this.newradio = this.jurisdicData[0].id; //默认第一个
        this.members = {}; //一整条数据
        this.members = this.jurisdicData[0].members;
        this.membersArryId = []; //内权限id
        this.membersArryId = this.jurisdicData[0].membersArryId;
      } else {
        //编辑
        const eventIndex = this.jurisdicData.findIndex(
          arrItem => arrItem.id === this.permissionId
        );
        this.newradio = this.jurisdicData[eventIndex].id; //默认第一个
        this.members = {}; //一整条数据
        this.members = this.jurisdicData[eventIndex].members;
        this.membersArryId = []; //内权限id
        this.membersArryId = this.jurisdicData[eventIndex].membersArryId;
      }
    },

    //列表数据处理
    dataHandle(newDate) {
      this.leeTeamData = [];
      newDate.forEach(element => {
        let jurisdiction = "";
        let status = false;
        let isChangjianzhe = false;
        element.allPerms.forEach(item => {
          jurisdiction += item.permissionsName + "/";
        });
        if (element.status == "0") {
          status = true;
        }
        if (element.memberRole.name == "创建者") {
          isChangjianzhe = true;
        }
        jurisdiction = jurisdiction.substr(0, jurisdiction.length - 1);
        this.leeTeamData.push({
          isChangjianzhe, //是否为创建者
          userOne: element.nickname.charAt(0), //用户名首字母
          id: element.id, //id
          nickname: element.nickname, //用户名
          email: element.email, //邮箱
          invitationState: element.invitationStatus, //邀请状态
          teamName: element.team.teamName, //团队名称
          teamId: element.team.id, //团队id
          team: element.team, //团队
          memberRoleName: element.memberRole.name, //角色
          memberRoleId: element.memberRole.id, //角色id
          memberRole: element.memberRole,
          jurisdiction, //权限
          perms: element.memberRole.perms,
          allOauthUsersId: element.allOauthUsersId, //社交账户
          number: element.allOauthUsersId.length, //社交账户数
          userId: element.userId,
          status //状态
        });
      });
      if (this.createUserId == this.leeTeamData[0].team.createUserId) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  },
  created() {
    this.createUserId = this.$store.getters.id;
    this.searchShareList.userId = this.$store.getters.id;
    const newDate = Object.assign({}, this.axiosData, {
      loginUserId: this.$store.getters.id
    });
    this.axiosData = Object.assign({}, this.axiosData, newDate);
    this.getItems();
  }
};
</script>

<style lang="scss" scoped>
$fontColor606266: #606266;
$fontWeight500: 500;
.pagination-container ::v-deep {
  .input-wrap-currentPage {
    & {
      display: inline-block;
      font-size: 14px;
      color: $fontColor606266;
      font-weight: $fontWeight500;
      margin-left: 16px;
      text-align: center;
    }
    span:last-child {
      text-align: left;
      margin-left: 5px;
      min-width: 18px;
    }
    .slot-input-currentPage {
      width: 60px;
      height: 28px;
    }
    input {
      height: 28px;
      line-height: 28px;
    }
  }
  .jumpPage-wrap {
    & {
      display: inline;
    }
    .jumpPage {
      & {
        font-weight: $fontWeight500;
        color: $fontColor606266;
      }
    }
  }
}
.shanchu {
  color: #ccc;
  cursor: no-drop;
}
.leeTeam {
  padding: 10px 10px 10px 0;
  min-height: calc(100vh - 84px);
  .account {
    width: 100%;
    -moz-flex-grow: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    display: -ms-flexbox;
    display: flex;
    min-height: calc(100vh - 84px);
    padding: 0 !important;
    .accountSlider {
      width: 260px;
      background: #fff;
      min-height: calc(100vh - 84px);
      > div {
        padding-left: 20px;
        padding-bottom: 10px;
        height: 60px;
        line-height: 60px;
        color: #666;
        font-size: 14px;
        cursor: pointer;
      }
      > div.active {
        background: rgba(15, 121, 249, 0.1);
        color: #0f79fa;
      }
      .ASHeader {
        margin: 17px 0 34px 20px;
        font-weight: 700;
        display: block;
      }
      .subtitle-text {
        font-size: 16px;
        color: #333;
        font-weight: bold;
      }
    }
  }
  .AccountRightCont {
    // width: 100%;
    height: 100%;
    flex: 1 1;
    box-sizing: border-box;
    padding: 0 12px 12px;
    display: -ms-flexbox;
    display: flex;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    .AccountTeamModule {
      width: 100%;
      height: 100%;
      .AccountTeamModule_Header {
        background: #fff;
        margin-bottom: 12px;
        overflow: hidden;
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        .team_name {
          font-size: 16px;
          line-height: 36px;
        }
        .team_right {
          display: flex;
          .team_input {
            display: flex;
            .el-input__inner {
              border-radius: 4px 0 0 4px;
            }
            .el-button {
              border-left: none;
              border-radius: 0 0 4px 4px;
            }
          }
          .team_margin {
            margin-right: 14px;
          }
        }
      }
      .AccountTeamModule_main {
        .el-dropdown-link {
          color: #7e7ef4;
        }
        .lee-tearm {
          margin-right: 4px;
        }
        .leeTableUser {
          display: flex;
          align-items: center;
          .left {
            width: 50px;
            min-width: 50px;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            text-align: center;
            color: #fff;
            border-radius: 25px;
            background-color: #7e7ef4;
          }
          .right {
            margin-left: 6px;
            font-size: 14px;
            font-weight: 700;
            color: #303133;
            h3 {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              word-break: break-all;
              font-size: 12px;
              line-height: 14px;
            }
            p {
              margin-top: -8px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              word-break: break-all;
              font-weight: 400;
              color: #c0c4cc;
              padding: 0;
              font-size: 12px;
              line-height: 14px;
            }
          }
        }
        .leeTableStatus1 {
          background: #fffdcc;
          color: #f5b813;
          height: 20px;
          border: none;
          line-height: 20px;
          font-size: 12px;
          font-weight: 400;
          padding: 4px 12px;
          border-radius: 4px;
        }
        .leeTableStatus2 {
          background: #f0f9eb;
          color: #67c23a;
          height: 20px;
          border: none;
          line-height: 20px;
          font-size: 12px;
          font-weight: 400;
          padding: 4px 12px;
          border-radius: 4px;
        }
        .leeTableStatus3 {
          background: #fef0f0;
          color: #f56c6c;
          height: 20px;
          border: none;
          line-height: 20px;
          font-size: 12px;
          font-weight: 400;
          padding: 4px 12px;
          border-radius: 4px;
        }
      }
    }
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.leeMail {
  padding: 30px 0;
  .leeMailTop {
    display: flex;
    span {
      display: block;
      width: 40px;
      color: #3a3a3a;
      font-size: 12px;
      margin-right: 8px;
      line-height: 36px;
    }
  }
  .leeMailBottom {
    padding-left: 48px;
    color: #ff7a21;
    font-size: 12px;
    min-height: 12px;
  }
}
.jurisd {
  padding: 24px 0;
  .jurisd_header {
    display: flex;
    span {
      width: 40px;
      min-width: 40px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      text-align: center;
      color: #fff;
      background-color: #0f79fa;
      border-radius: 20px;
      display: block;
    }
    em {
      font-style: normal;
      font-size: 12px;
      margin-left: 13px;
      display: block;
      line-height: 40px;
    }
  }
  .jurisd_Bom {
    .assign_page_Tip {
      color: #333;
      font-size: 12px;
      padding-left: 30px;
    }
    .bottom {
      padding-top: 4px;
      .newdiv {
        display: flex;
        margin-bottom: 12px;
        line-height: 20px;
        .left {
          width: 80px;
        }
      }
    }
  }
}
.assign-page-wrap {
  position: relative;
  width: 600px;
  height: -webkit-max-content;
  height: -moz-max-content;
  height: max-content;
  padding-bottom: 10px;
  border-radius: 4px;
  .selects-account-con {
    width: 100%;
    .selects-account-Choice {
      display: -ms-flexbox;
      display: flex;
      .select-account {
        padding-left: 25px;
        padding-right: 14px;
        .select-title {
          line-height: 32px;
          font-weight: 700;
          color: #333;
          padding-top: 5px;
          display: -ms-flexbox;
          display: flex;
          -moz-justify-content: space-between;
          -ms-flex-pack: justify;
          justify-content: space-between;
          font-size: 12px;
          > span:nth-child(2) {
            cursor: pointer;
            font-weight: 400;
            color: #0f79fa;
          }
        }
        .select-box {
          height: 376px;
          padding: 10px 12px;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          overflow: hidden;

          .PageListMainTitlePlatform {
            display: -ms-flexbox;
            display: flex;
            margin-bottom: 12px;
            > div {
              color: #555;
              position: relative;
              cursor: pointer;
              margin-right: 14px;
              height: 26px;
              line-height: 26px;
              display: -ms-flexbox;
              display: flex;
              .iconfont {
                display: inline-block;
                width: 26px;
                height: 26px;
                line-height: 27px;
                text-align: center;
                border-radius: 50%;
                font-size: 16px;
                box-shadow: 0 4px 10px 0 hsla(0, 0%, 55.3%, 0.3);
                background: #fff;
              }
              .iconffbb {
                background: #fff;
                border-radius: 50%;
                color: #1877f2;
              }
            }
            > div.PageListMainTitleAcitveall {
              color: #fff;
              background: #2751ff;
              width: 24px;
              padding-left: 5px;
              border-radius: 50%;
              box-shadow: 0 4px 10px 0 rgba(39, 81, 255, 0.3);
              border-radius: 13px;
              margin-right: 15px;
              text-align: center;
              height: 26px;
              span {
                text-align: center;
                font-size: 12px;
              }
            }
            > div.PageListMainTitleAcitveall2 {
              color: #2751ff;
              background: #fff;
              box-shadow: 0 4px 10px 0 rgba(39, 81, 255, 0.3);
              margin-right: 15px;
              span {
                text-align: center;
                font-size: 12px;
              }
            }
          }
          .select_account {
            display: -ms-flexbox;
            display: flex;
            -moz-flex-direction: column;
            -ms-flex-direction: column;
            flex-direction: column;
            height: 287px;
            .search_input_wrap {
              width: 223px;
              min-height: 28px;
              display: -ms-flexbox;
              display: flex;
              -moz-align-items: center;
              -ms-flex-align: center;
              align-items: center;
              -moz-justify-content: space-between;
              -ms-flex-pack: justify;
              justify-content: space-between;
              -ms-flex-negative: 0;
              flex-shrink: 0;
            }
            .UserPagesUl {
              overflow: auto;
              margin: 0;
              padding: 0;
              .UserPagesUlliActive {
                margin-top: 8px;
                padding: 0;
                list-style: none;
                ::v-deep .el-checkbox {
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
                  color: #666;
                  font-size: 12px;
                  font-variant: tabular-nums;
                  line-height: 1.5715;
                  list-style: none;
                  font-feature-settings: "tnum", "tnum";
                  display: inline-block;
                  line-height: unset;
                  cursor: pointer;
                  display: flex;
                  -moz-align-items: center;
                  -ms-flex-align: center;
                  align-items: center;
                }
              }
              ::v-deep .account-item {
                width: 100%;
                height: 45px;
                display: -ms-flexbox;
                display: flex;
                -moz-align-items: center;
                -ms-flex-align: center;
                align-items: center;
                .userImg {
                  width: 30px;
                  height: 30px;
                  border-radius: 15px;
                  margin-right: 5px;
                  margin-left: 0;
                  -ms-flex-negative: 0;
                  flex-shrink: 0;
                }
                .userName {
                  padding: 0;
                  margin: 0;
                  margin-block-start: 0;
                  margin-block-end: 0;
                  display: -ms-flexbox;
                  display: flex;
                  -moz-align-items: center;
                  -ms-flex-align: center;
                  align-items: center;
                  font-size: 12px;
                  color: #333;
                  img {
                    width: 16px;
                    height: 16px;
                    margin-right: 4px;
                    margin-top: -2px;
                  }
                  .page-name-text {
                    width: 120px;
                    margin-block-start: 0;
                    margin-block-end: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    font-size: 12px;
                    color: #333;
                    white-space: nowrap;
                  }
                }
                .pageName {
                  margin-block-start: 0;
                  margin-block-end: 0;
                  display: -ms-flexbox;
                  display: flex;
                  -moz-align-items: center;
                  -ms-flex-align: center;
                  align-items: center;
                  font-size: 12px;
                  color: #999;
                  .iconfont {
                    font-size: 12px;
                    margin-left: 0;
                    color: #ff7922;
                    margin-right: 3px;
                  }
                  .page-name-text {
                    width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    white-space: nowrap;
                  }
                }
              }
            }
            .select_all_wrap {
              height: 40px;
              line-height: 40px;
            }
          }
          .account-item-list {
            .account-item-wrap {
              .account-list-item {
                display: -ms-flexbox;
                display: flex;
                -moz-align-items: center;
                -ms-flex-align: center;
                align-items: center;
                -moz-justify-content: space-between;
                -ms-flex-pack: justify;
                justify-content: space-between;
                margin-bottom: 8px;
                color: #555;
                font-size: 12px;
                .account-item {
                  width: 100%;
                  height: 45px;
                  display: -ms-flexbox;
                  display: flex;
                  -moz-align-items: center;
                  -ms-flex-align: center;
                  align-items: center;
                  .userImg {
                    width: 30px;
                    height: 30px;
                    border-radius: 15px;
                    margin-right: 5px;
                    margin-left: 0;
                    -ms-flex-negative: 0;
                    flex-shrink: 0;
                  }
                  .userName {
                    padding: 0;
                    margin: 0;
                    margin-block-start: 0;
                    margin-block-end: 0;
                    display: -ms-flexbox;
                    display: flex;
                    -moz-align-items: center;
                    -ms-flex-align: center;
                    align-items: center;
                    font-size: 12px;
                    color: #333;
                    margin-bottom: 4px;
                    img {
                      width: 14px;
                      height: 14px;
                      margin-right: 4px;
                      margin-top: -2px;
                    }
                    .page-name-text {
                      margin-block-start: 0;
                      margin-block-end: 0;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 1;
                      -webkit-box-orient: vertical;
                      word-break: break-all;
                      font-size: 12px;
                      color: #333;
                    }
                  }
                  .pageName {
                    margin-block-start: 0;
                    margin-block-end: 0;
                    display: -ms-flexbox;
                    display: flex;
                    -moz-align-items: center;
                    -ms-flex-align: center;
                    align-items: center;
                    font-size: 12px;
                    color: #999;
                    .iconfont {
                      font-size: 12px;
                      margin-left: 0;
                      color: #ff7922;
                      margin-right: 3px;
                    }
                    .page-name-text {
                      overflow: hidden;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 1;
                      -webkit-box-orient: vertical;
                      word-break: break-all;
                    }
                  }
                }
                .close-item {
                  cursor: pointer;
                  .iconfont {
                    display: inline-block;
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.leeMail-footer {
  text-align: center;
  margin-bottom: 20px;
}
.leeUserqh {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  height: 40px;
}
.leeUserqh div {
  width: 128px;
  line-height: 38px;
  font-size: 14px;
  color: #7e7ef4;
  border: 1px solid #7e7ef4;
  background: #fff;
  cursor: pointer;
  text-align: center;
}
.leeUserqh .active {
  background: #7e7ef4;
  color: #fff;
}
.deleteUserzz {
  width: 100%;
  height: auto;
  margin: 30px 0;
  color: #666;
  font-size: 14px;
  white-space: pre-wrap;
  padding: 0 20px;
  box-sizing: border-box;
  .bottom {
    font-size: 12px;
    margin-top: 10px;
    color: #999;
    font-weight: 400;
  }
}
</style>
 


<style lang="scss">
@import "../../styles/variables.scss";
</style>
